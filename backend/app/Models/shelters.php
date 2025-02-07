<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class shelters extends Model
{
    use HasFactory;
    protected $table='shelters';
    protected $primaryKey = 'shelter_id';
    protected $incrementing= true;
    protected $fillable = ['shelterName','thana','Disctrict','Capacity','shelterPhone'];
    public $timestamps = false;
    protected $keyType='integer';
}
