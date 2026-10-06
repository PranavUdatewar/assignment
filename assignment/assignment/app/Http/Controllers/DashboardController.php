<?php

namespace App\Http\Controllers;

use App\Http\Requests\DashboardRequest;
use App\Http\Requests\DayOverviewRequest;
use App\Services\DashboardService;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $dashboardService) {}

    public function summary(DashboardRequest $request)
    {
        $data = $this->dashboardService->summary($request->validated());

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function dayOverview(DayOverviewRequest $request)
    {
        $data = $this->dashboardService->dayOverview($request->validated());

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }
}
