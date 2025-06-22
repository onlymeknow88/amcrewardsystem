<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionPoint extends Model
{
    protected $table = 'transaction_points';

    protected $guarded = [];

     protected $appends = ['NameEmployee'];

    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }

    public function getNameEmployeeAttribute()
    {
        return $this->employe->EmpName;
    }

    public function claimHistories()
    {
        return $this->hasMany(ClaimHistory::class);
    }
}
