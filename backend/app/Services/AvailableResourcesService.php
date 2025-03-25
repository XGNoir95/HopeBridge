<?php

namespace App\Services;

use App\Models\AvailableResources;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AvailableResourcesService
{
    public function createDonation($request)
    {
        $data = $request->all();
        $validator = validator::make($data, [
            'name' => 'required|string|max:255',
            'mail' => 'required|string',
            'itemDescription' => 'required|string|max:255',
            'quantity' => 'required|integer',
            'pickUpLocation' => 'required|string'
        ]);
        if ($validator->fails()) {
            return null;
        }
        $validatedData = $validator->validated();
        $donation = availableResources::create([
            'donorName' => $validatedData['name'],
            'donorMail' => $validatedData['mail'],
            'itemDescription' => $validatedData['itemDescription'],
            'quantity' => $validatedData['quantity'],
            'pickUpLocation' => $validatedData['pickUpLocation']
        ]);
        return $donation;
    }
    // show a specific donation
    public function getDonation($id)
    {
        $result = DB::select('select * from available_resources where itemId=?', [$id]);
        return $result;
    }
    //  get all Donation
    public function getAllDonation()
    {
        $result = DB::select('select * from available_resources');
        return $result;
    }
    // get quantity by itemDescription
    public function getQuantity($itemDescription)
    {
        $result = DB::select('select itemDescription as Item,SUM(quantity) as Amount from available_resources where itemDescription =? group by Item', [$itemDescription]);
        $result = (array)$result[0];
        return $result;
    }
}
