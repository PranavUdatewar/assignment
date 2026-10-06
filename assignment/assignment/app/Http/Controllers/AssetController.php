<?php

namespace App\Http\Controllers;

use App\Services\AssetService;

class AssetController extends Controller
{
    public function __construct(protected AssetService $assetService) {}

    public function index()
    {
        return response()->json([
            'status' => true,
            'data' => $this->assetService->list(),
        ]);
    }
}
