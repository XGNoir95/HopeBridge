<?php

namespace App\Services;

use App\Models\User;
use App\Models\Donor;
use App\Models\Volunteer;
use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DonorService
{
    public function createDonor($request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'id' => 'required|integer',
            'division' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'gender' => 'required|string|max:10'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $userData = DB::select("select * from users WHERE user_id = ?", [$validatedData['id']]);
        if (!$userData) {
            return null;
        }
        $user = (array) $userData[0];
        $result = Donor::create([
            'user_id' => $validatedData['id'],
            'division' => $validatedData['division'],
            'district' => $validatedData['district'],
            'gender' => $validatedData['gender']
        ]);
        $donorData = [
            'donorName' => $user['userName'] ?? '',
            'blood_group' => $user['blood_group'] ?? '',
            'donorPhone' => $user['userPhone'] ?? '',
            'donorMail' => $user['userMail'] ?? '',
            'user_id' => $result['user_id'],
            'division' => $result['division'],
            'district' => $result['district'],
            'gender' => $result['gender']
        ];
        return $donorData;
    }
    //delete donor data
    public function deleteDonor($id)
    {
        $result = DB::select('select donorId from donor where donorId= ?', [$id]);
        if ($result) {
            DB::delete('Delete from donor where donorId = ?', [$id]);
            return true;
        }
    }
    // find donor by donor_id
    public function getDonorById($id)
    {
        $donors = $this->getAllDonor();
        foreach ($donors as $donor) {
            if ($donor->DonorId == $id) {
                return $donor;
            }
        }
        return null;
    }
    // get all donor
    public function getAllDonor()
    {
        $ques = "
            SELECT 
            d.donorId as DonorId,
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
    public function createVolunteer($request)
    {

        $userId = $request->attributes->get('user_id');

        $userData = User::where('user_id', $userId)->first();
        if (!$userData) {
            return null;
        }

        // $result=DB::select('select user_id from users where user_id = ?',[$user_id]);
        // if($result){
        //     return null;
        // }
        //$result=(array)$result[0];

        $existingVolunteer = Volunteer::where('user_id', $userId)->first();
        if ($existingVolunteer) {
            return null;
        }
        $volunteer = Volunteer::create([
            'user_id' => $userId
        ]);
        $volunteerData = [
            'volunteerName' => $userData->userName,
            'volunteerMail' => $userData->userMail,
            'blood_group' => $userData->blood_group,
            'division' => $userData->division,
            'district' => $userData->district
        ];
        return $volunteerData;
    }

    public function deleteVolunteer($id)
    {
        $result = DB::select('select * from volunteer where user_id = ?', [$id]);
        if ($result) {
            DB::delete('delete from volunteer where user_id= ?', [$id]);
            return true;
        }
        return false;
    }
    public function getAllVolunteer()
    {
        $sqlQuery = "
            select
            v.volunteer_id as VolunteerId,
            u.userName as volunteerName,
            u.userMail as volunteerMail,
            u.blood_group as BloodGroup,
            u.district as District
            from
            volunteer as v
            inner join 
            users as u
            where
            v.user_id=u.user_id
        ";
        $result = DB::select($sqlQuery);
        return $result;
    }
    public function getVolunterById($id)
    {
        $volunteers = $this->getAllVolunteer();
        foreach ($volunteers as $volunteer) {
            if ($volunteer->VolunteerId == $id) {
                return $volunteer;
            }
        }
        return null;
    }
}
