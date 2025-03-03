<?php

namespace App\Services;

use App\Models\donor;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DonorService{
    public function createDonor($request){
        $validator = Validator::make($request, [
            'id' => 'required|integer|max:255',
            'division' => 'required|string|max:255',
            'district'=>'required|string|max:255',
            'gender'=>'required|string|max:10'
        ]);
    
        if ($validator->fails()) {
            throw new \InvalidArgumentException($validator->errors()->first());
        }
        $user_id=$request->attirbute->get('id');
        $validatedData = $validator->validated();
        $result=donor::create([
            'user_id'=>$validatedData['id'],
            'divison'=>$validatedData['division'],
            'district'=>$validatedData['district'],
            'gender'=>$validatedData['gender']
        ]);
        $userData=DB::select("select * from users where user_id = ?",[$user_id]);
        $donorData =[
            'donorName'=>$userData['userName'],
            'blood_group'=>$userData['blood_group'],
            'donorPhone'=>$userData['userPhone'],
            'donorMail'=>$userData['userMail'],
            'user_id'=>'id',
            'division'=>'divison',
            'district'=>'district',
            'gender'=>'gender'
        ];
        $result= json_encode($donorData,JSON_PRETTY_PRINT);
        return $result;
    }
    //delete donor data
    public function deleteDonor($id){
        $result =DB::select('select donorId from donor where donorId= ?',[$id]);
        if($result){
            DB::delete('Delete from donor where donorId = ?',[$id]);
            return true;
        }
    }
    // find donor by user_id
    public function getDonorById($id){
        $don=$this->getAllDonor();
        foreach($don as $key){
            if($don['user_id']==$id)
                return $key;
        }
        return null;
    }
    // get all donor
    public function getAllDonor(){
        $ques = "
            SELECT 
            u.user_id AS user_id,
            u.userName AS donorName,
            u.userMail AS donorMail,
            u.userPhone AS donorPhone,
            u.blood_group,
            d.division,
            d.district,
            d.gender
        FROM 
            donor AS d
        INNER JOIN 
            users AS u 
        ON 
            u.user_id = d.user_id;
        ";
        $result = DB::select($ques);
        return $result;
    }
}