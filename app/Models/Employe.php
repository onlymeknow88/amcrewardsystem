<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employe extends Model
{
    protected $table = 'employes';

    protected $fillable = [
        'EmpName',
        'Company',
        'JobTitle',
    ];

     public function transactionPoints()
    {
        return $this->hasMany(TransactionPoint::class);
    }

    public function claimHistories()
    {
        return $this->hasMany(ClaimHistory::class);
    }
}
