<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClaimHistory extends Model
{
    protected $table = 'claim_histories';

    protected $guarded = [];

    protected $appends = ['NameEmployee'];

    public function prize()
    {
        return $this->belongsTo(Prize::class);
    }

    public function transactionPoint()
    {
        return $this->belongsTo(TransactionPoint::class, 'transaction_id', 'id');
    }

    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }

    public function getNameEmployeeAttribute()
    {
        return $this->employe->EmpName;
    }
}
