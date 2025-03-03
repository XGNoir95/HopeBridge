<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Shelter;
use App\Services\DonorService;

class ShelterController extends Controller
{
    protected $donorservice;

    public function __construct(DonorService $donorservice) {
        $this->donorservice = $donorservice; // Corrected this line
    }
    public function storeDonor(Request $request){
        $result=$this->donorservice->createDonor($request);
        if($result){
            return response()->json([
                'success'=>true,
                'Donor'=>$result
            ],200);
        }
        return response()->json([
            'success'=>false,
            'message'=>'Failed to create Donor'
        ],400);
    }
    public function indexDonor(){
        $res = $this->donorservice->getAllDonor();
        if ($res) {
            return response()->json([
                'success' => true,
                'donors' => $res
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'No Donor Found'
        ], 404);
    }
    public function showDonor($id){
        $result =$this->donorservice->getDonorById($id);
        if($result){
            return response()->json([
                'success'=>true,
                'Donor'=>$result
            ],200);
        }
        return response()->json([
            'success'=>false,
            'message'=>'Donor not found'
        ],404);
    }
    public function destroyDonor($d){
        $res=$this->donorservice->deleteDonor($d);
        if($res){
            return response()->json([
                'success'=>true,
                'message'=>'Donor Deleted Successfully'
            ],200);
        }
        return response()->json([
            'success'=>false,
            'message'=>'Failed to Delete Donor'
        ],404);
    }
}
