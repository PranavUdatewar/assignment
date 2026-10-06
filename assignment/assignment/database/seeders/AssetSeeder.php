<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\AssetActivity;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    public function run(): void
    {
        $names = ['BL-08', 'Q-47898', 'D-26653'];
        $start = Carbon::today()->subDays(60);
        $end = Carbon::today();

        foreach ($names as $name) {
            $asset = Asset::create(['name' => $name, 'type' => 'loader']);
            $rows = [];

            for ($day = $start->copy(); $day->lte($end); $day->addDay()) {
                foreach ($this->dayActivities($day) as $activity) {
                    $rows[] = array_merge($activity, [
                        'asset_id' => $asset->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            foreach (array_chunk($rows, 500) as $chunk) {
                AssetActivity::insert($chunk);
            }
        }
    }

    private function dayActivities(Carbon $day): array
    {
        $activities = [];
        $dayStart = $day->copy()->startOfDay();
        $dayEnd = $day->copy()->addDay()->startOfDay();

        $isHoliday = $day->isSunday() ? rand(1, 100) <= 60 : rand(1, 100) <= 10;

        if ($isHoliday) {
            $activities[] = $this->makeActivity(AssetActivity::IGNITION_OFF, $dayStart, $dayEnd);

            return $activities;
        }

        $workStart = $dayStart->copy()->addMinutes(rand(7 * 60, 10 * 60));
        $workEnd = $dayStart->copy()->addMinutes(rand(16 * 60, 19 * 60));

        $activities[] = $this->makeActivity(AssetActivity::IGNITION_OFF, $dayStart, $workStart);

        $current = $workStart->copy();

        while ($current->lt($workEnd)) {
            $chance = rand(1, 100);

            if ($chance <= 50) {
                $status = AssetActivity::IGNITION;
                $minutes = rand(20, 150);
            } elseif ($chance <= 80) {
                $status = AssetActivity::IDLING;
                $minutes = rand(10, 60);
            } elseif ($chance <= 85) {
                $status = AssetActivity::ALERT;
                $minutes = rand(2, 6);
            } else {
                $status = AssetActivity::IGNITION_OFF;
                $minutes = rand(15, 60);
            }

            $next = $current->copy()->addMinutes($minutes);

            if ($next->gt($workEnd)) {
                $next = $workEnd->copy();
            }

            $activities[] = $this->makeActivity($status, $current, $next);
            $current = $next;
        }

        $activities[] = $this->makeActivity(AssetActivity::IGNITION_OFF, $workEnd, $dayEnd);

        return $activities;
    }

    private function makeActivity(string $status, Carbon $from, Carbon $to): array
    {
        $minutes = (int) $from->diffInMinutes($to);
        $distance = 0;
        $messages = intdiv($minutes, 10);

        if ($status == AssetActivity::IGNITION) {
            $distance = round($minutes * rand(4, 12) / 100, 2);
            $messages = $minutes * rand(2, 4);
        } elseif ($status == AssetActivity::IDLING || $status == AssetActivity::ALERT) {
            $messages = $minutes * rand(1, 2);
        }

        return [
            'status' => $status,
            'started_at' => $from->toDateTimeString(),
            'ended_at' => $to->toDateTimeString(),
            'duration_minutes' => $minutes,
            'distance_km' => $distance,
            'messages_count' => $messages,
        ];
    }
}
