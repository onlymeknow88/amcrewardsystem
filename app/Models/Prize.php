<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prize extends Model
{
    protected $table = 'prizes';
    protected $guarded = [];

     public function claimHistories()
    {
        return $this->hasMany(ClaimHistory::class);
    }

    public function getImageUrlAttribute()
    {
        return $this->ImagePath ? asset('storage/' . $this->ImagePath) : null;
    }
}
