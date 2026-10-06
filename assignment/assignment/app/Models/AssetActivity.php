<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetActivity extends Model
{
    const IGNITION_OFF = 'ignition_off';

    const IGNITION = 'ignition';

    const IDLING = 'idling';

    const ALERT = 'alert';

    protected $fillable = [
        'asset_id',
        'status',
        'started_at',
        'ended_at',
        'duration_minutes',
        'distance_km',
        'messages_count',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'distance_km' => 'float',
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }
}
