<?php

namespace App\Services;

use App\Models\Asset;
use App\Models\AssetActivity;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class DashboardService
{
    public function summary(array $filters)
    {
        $from = Carbon::parse($filters['from'])->startOfDay();
        $to = Carbon::parse($filters['to'])->endOfDay();
        $assetId = $filters['asset_id'] ?? null;

        $totalDays = (int) $from->diffInDays($to->copy()->startOfDay()) + 1;
        $previousFrom = $from->copy()->subDays($totalDays);
        $previousTo = $from->copy()->subSecond();

        $current = $this->dailyData($from, $to, $assetId);
        $previous = $this->dailyData($previousFrom, $previousTo, $assetId);

        $currentDates = $this->dates($from, $to);
        $previousDates = $this->dates($previousFrom, $previousTo);

        $distance = [];
        $engineHours = [];
        $messages = [];

        foreach ($currentDates as $index => $date) {
            $day = $current[$date] ?? $this->emptyDay();
            $previousDay = $previous[$previousDates[$index]] ?? $this->emptyDay();

            $distance[] = [
                'date' => $date,
                'current' => round($day['distance'], 1),
                'previous' => round($previousDay['distance'], 1),
            ];

            $engineHours[] = [
                'date' => $date,
                'ignition' => round($day['ignition'] / 60, 1),
                'idling' => round($day['idling'] / 60, 1),
            ];

            $messages[] = [
                'date' => $date,
                'count' => $day['messages'],
            ];
        }

        $currentDistance = array_sum(array_column($distance, 'current'));
        $previousDistance = array_sum(array_column($distance, 'previous'));

        return [
            'distance' => [
                'total' => round($currentDistance),
                'change' => $this->percentChange($currentDistance, $previousDistance),
                'items' => $distance,
            ],
            'engine_hours' => $engineHours,
            'activity' => $this->activityBreakdown($current),
            'messages' => $messages,
        ];
    }

    public function dayOverview(array $filters)
    {
        $date = Carbon::parse($filters['date']);
        $assetId = $filters['asset_id'] ?? null;

        $assets = Asset::query()
            ->when($assetId, fn ($query) => $query->where('id', $assetId))
            ->with(['activities' => function ($query) use ($date) {
                $query->whereDate('started_at', $date->toDateString())->orderBy('started_at');
            }])
            ->orderBy('name')
            ->get();

        $startMinute = null;
        $endMinute = null;
        $result = [];

        foreach ($assets as $asset) {
            $totals = [];
            $timeline = [];

            foreach ($asset->activities as $activity) {
                $totals[$activity->status] = ($totals[$activity->status] ?? 0) + $activity->duration_minutes;

                if ($activity->status == AssetActivity::IGNITION_OFF) {
                    continue;
                }

                $start = $activity->started_at->hour * 60 + $activity->started_at->minute;
                $end = $start + $activity->duration_minutes;

                $startMinute = $startMinute === null ? $start : min($startMinute, $start);
                $endMinute = $endMinute === null ? $end : max($endMinute, $end);

                $last = count($timeline) - 1;

                if ($last >= 0 && $timeline[$last]['status'] == $activity->status && $timeline[$last]['end'] == $start) {
                    $timeline[$last]['end'] = $end;
                    $timeline[$last]['to'] = $activity->ended_at->format('H:i');

                    continue;
                }

                $timeline[] = [
                    'status' => $activity->status,
                    'start' => $start,
                    'end' => $end,
                    'from' => $activity->started_at->format('H:i'),
                    'to' => $activity->ended_at->format('H:i'),
                ];
            }

            $percentages = [];
            foreach ([AssetActivity::IGNITION_OFF, AssetActivity::IDLING, AssetActivity::IGNITION, AssetActivity::ALERT] as $status) {
                if (! empty($totals[$status])) {
                    $percentages[] = [
                        'status' => $status,
                        'value' => round($totals[$status] / 1440 * 100, 1),
                    ];
                }
            }

            $result[] = [
                'id' => $asset->id,
                'name' => $asset->name,
                'percentages' => $percentages,
                'timeline' => $timeline,
            ];
        }

        return [
            'date' => $date->toDateString(),
            'start_hour' => $startMinute === null ? 8 : intdiv($startMinute, 60),
            'end_hour' => $endMinute === null ? 18 : (int) ceil($endMinute / 60),
            'assets' => $result,
        ];
    }

    private function dailyData(Carbon $from, Carbon $to, $assetId)
    {
        $rows = AssetActivity::query()
            ->selectRaw('date(started_at) as day, status, sum(duration_minutes) as minutes, sum(distance_km) as distance, sum(messages_count) as messages')
            ->whereBetween('started_at', [$from, $to])
            ->when($assetId, fn ($query) => $query->where('asset_id', $assetId))
            ->groupBy('day', 'status')
            ->get();

        $data = [];

        foreach ($rows as $row) {
            if (! isset($data[$row->day])) {
                $data[$row->day] = $this->emptyDay();
            }

            $status = $row->status == AssetActivity::ALERT ? AssetActivity::IGNITION : $row->status;

            $data[$row->day][$status] += (int) $row->minutes;
            $data[$row->day]['distance'] += (float) $row->distance;
            $data[$row->day]['messages'] += (int) $row->messages;
        }

        return $data;
    }

    private function activityBreakdown(array $days)
    {
        $labels = [
            AssetActivity::IGNITION_OFF => 'Ignition Off',
            AssetActivity::IGNITION => 'Ignition',
            AssetActivity::IDLING => 'Idling',
        ];

        $items = [];
        $total = 0;

        foreach ($labels as $status => $label) {
            $hours = round(array_sum(array_column($days, $status)) / 60);
            $total += $hours;

            $items[] = [
                'status' => $status,
                'label' => $label,
                'hours' => $hours,
            ];
        }

        return [
            'total' => $total,
            'items' => $items,
        ];
    }

    private function dates(Carbon $from, Carbon $to)
    {
        $dates = [];

        foreach (CarbonPeriod::create($from->copy()->startOfDay(), $to->copy()->startOfDay()) as $date) {
            $dates[] = $date->toDateString();
        }

        return $dates;
    }

    private function percentChange($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round(($current - $previous) / $previous * 100);
    }

    private function emptyDay()
    {
        return [
            AssetActivity::IGNITION_OFF => 0,
            AssetActivity::IGNITION => 0,
            AssetActivity::IDLING => 0,
            'distance' => 0,
            'messages' => 0,
        ];
    }
}
