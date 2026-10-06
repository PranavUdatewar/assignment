<?php

namespace App\Services;

use App\Models\Asset;

class AssetService
{
    public function list()
    {
        return Asset::select('id', 'name', 'type')->orderBy('name')->get();
    }
}
