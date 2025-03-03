<?php

namespace App\Services;

use App\Models\DonatedMoney;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DonatedMoneyService{
    public function createDonation($request){
        $data=$request->all();
        $validator=validator::make($data,[
            'id'=>'required|integer',
            'amount'=>'required|integer',
            'paymentMethod'=>'required|string'
        ]);
        if($validator->fails()){
            return null;
        }
        $validatedData=$validator->validated();
        $userData = DB::select("select * from users WHERE user_id = ?", [$validatedData['id']]);
        if(!$userData){
            return null;
        }
        $userData=(array)$userData[0];
        $result=DonatedMoney::create([
            'user_id'=>$validatedData['id'],
            'amount'=>$validatedData['amount'],
            'paymentMethod'=>$validatedData['paymentMethod']
        ]);
        $donationData=[
            'donorName'=>$userData['userName'],
            'donorMail'=>$userData['userMail'],
            'donorPhone'=>$userData['userPhone'],
            'user_id'=>$result['user_id'],
            'amount'=>$result['amount'],
            'paymentMethod'=>$result['paymentMethod']
        ];
        return $donationData;
    }
    public function deleteDonation($donationId){
        $result =DB::select('select * from donated_money where donation_id = ?',[$donationId]);
        if($result){
            DB::delete('delete from donated_money where donation_id = ?',[$donationId]);
            return true;
        }
        return false;
    }
    public function getAllDonation(){
        $sqlQuery="
            select
            d.donation_id as DonationId,
            u.user_id as user_id,
            u.userName as donorName,
            u.userMail as donorMail,
            u.userPhone as donorPhone,
            d.amount as Amount,
            d.paymentMethod as PaymentMethod
            FROM
                donated_money as d
            INNER JOIN
                users as u
            ON
                u.user_id=d.user_id
        ";
        $result=DB::select($sqlQuery);
        return $result;
    }
    public function getDonationById($donationId){
        $donations =$this->getAllDonation();
        foreach($donations as $donation){
            if($donation["DonationId"]==$donationId)
                return $donation;
        }
        return null;
    }
    public function donatedAmount(){
        $donations=$this->getAllDonation();
        $totalAmount=0;
        foreach($donations as $donation){
            $totalAmount+=$donation->Amount;
        }
        $data=[
            'totalDonatedMoney'=>$totalAmount
        ];
        return $data;
    }
}