<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Shelter;

class ShelterController extends Controller
{
    public function index()
    {
        $shelters = Shelter::all();
        return response()->json($shelters);
    }
   //Single Shelter info
   public function show($id)
   {
       $shelter = Shelter::findOrFail($id);
   
       $userLatitude = request()->input('latitude');
       $userLongitude = request()->input('longitude');
   
       if (!$userLatitude || !$userLongitude) {
           return response()->json(['error' => 'User location is required'], 400);
       }
   
      //Distance from User to selected Shelter
       $distance = $this->calculateDistance(
           $userLatitude,
           $userLongitude,
           $shelter->latitude,
           $shelter->longitude
       );
       return response()->json([
           'shelter' => $shelter,
           'user_location' => [
               'latitude' => $userLatitude,
               'longitude' => $userLongitude,
           ],
           'distance' => $distance,
       ]);
   }
  //calculate distance between User and Shelter
   private function calculateDistance($lat1, $lon1, $lat2, $lon2)
   {
       //In kilometers
       $earthRadius = 6371; 

       $latFrom = deg2rad($lat1);
       $lonFrom = deg2rad($lon1);
       $latTo = deg2rad($lat2);
       $lonTo = deg2rad($lon2);

       $latDelta = $latTo - $latFrom;
       $lonDelta = $lonTo - $lonFrom;

       $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
           cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

       return round($angle * $earthRadius, 2);
   }
   
}