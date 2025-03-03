<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonatedMoney extends Model
{
    use HasFactory;
    protected $table='donated_money';
    protected $primarykey='donation_id';
    public $incrementing =true;
    protected $fillable=[
        'user_id',
        'amount',
        'paymentMethod'
    ];

}
