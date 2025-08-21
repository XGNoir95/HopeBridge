<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class availableResources extends Model
{
    use HasFactory;
    protected $table ="available_resources";
    protected $primaryKey="itemId";
    public $incrementing =true;
    protected $fillable= [
        'donorName',
        'donorMail',
        'itemDescription',
        'quantity',
        'pickUpLocation',
        'pickUpDate',
        'expirationDate'
    ];
}
