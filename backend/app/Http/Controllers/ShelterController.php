<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shelter;
use App\Services\DonorService;
use App\Services\AvailableResourcesService;
use App\Services\DonatedMoneyService;

class ShelterController extends Controller
{
    protected $donorservice;
    protected $arService;
    protected $donatedMoneyService;

    public function __construct(
        DonorService $donorservice,
        AvailableResourcesService $arService,
        DonatedMoneyService $donatedMoneyService
    ) {
        $this->donorservice = $donorservice; // Corrected this line
        $this->arService = $arService;
        $this->donatedMoneyService = $donatedMoneyService;
    }
    public function storeDonor(Request $request)
    {
        $result = $this->donorservice->createDonor($request);
        if ($result) {
            return response()->json([
                'success' => true,
                'Donor' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to create Donor'
        ], 400);
    }
    public function indexDonor()
    {
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
    public function showDonor($id)
    {
        $result = $this->donorservice->getDonorById($id);
        if ($result) {
            return response()->json([
                'success' => true,
                'Donor' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Donor not found'
        ], 404);
    }
    public function destroyDonor($d)
    {
        $res = $this->donorservice->deleteDonor($d);
        if ($res) {
            return response()->json([
                'success' => true,
                'message' => 'Donor Deleted Successfully'
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to Delete Donor'
        ], 404);
    }
    public function storeDonation(Request $request)
    {
        $result = $this->arService->createDonation($request);
        if ($result) {
            return response()->json([
                'success' => true,
                'Donations' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to create Donation'
        ], 404);
    }

    public function indexDonation()
    {
        $result = $this->arService->getAllDonation();
        if ($result) {
            return response()->json([
                'success' => true,
                'Donations' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch Donations'
        ], 404);
    }
    public function showDonation($id)
    {
        $result = $this->arService->getDonation($id);
        if ($result) {
            return response()->json([
                'success' => true,
                'Donations' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch Donation'
        ], 404);
    }
    public function itemQuantity($itemDescription)
    {
        $result = $this->arService->getQuantity($itemDescription);
        if ($result) {
            return response()->json([
                'success' => true,
                'Donations' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch Amount'
        ], 404);
    }
    public function storeMoneyDonation(Request $request)
    {
        $result = $this->donatedMoneyService->createDonation($request);
        if ($result) {
            return response()->json([
                'success' => true,
                'Donations' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to create Donation'
        ], 404);
    }
    public function donationAmount()
    {
        $result = $this->donatedMoneyService->donatedAmount();
        if ($result) {
            return response()->json([
                'success' => true,
                'DonatedAmount' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch data'
        ], 404);
    }
    public function deleteMoneyDonation($donationId)
    {
        $result = $this->donatedMoneyService->deleteDonation($donationId);
        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Donation deleted successfully'
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to Delete Donation'
        ], 404);
    }
    public function indexMoneyDonation()
    {
        $result = $this->donatedMoneyService->getAllDonation();
        if ($result) {
            return response()->json([
                'success' => true,
                'Donations' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch Donations'
        ], 404);
    }
    public function showMoneyDonation($donationId)
    {
        $result = $this->donatedMoneyService->getDonationById($donationId);
        if ($result) {
            return response()->json([
                'success' => true,
                'Donation' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch Donation'
        ], 404);
    }
    public function indexVolunteer()
    {
        $result = $this->donorservice->getAllVolunteer();
        if ($result) {
            return response()->json([
                'success' => true,
                'volunteer' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch Volunteers List'
        ], 404);
    }
    public function destroyVolunteer($id)
    {
        $result = $this->donorservice->deleteVolunteer($id);
        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Volunteer removed successfully'
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to delete volunteer'
        ], 404);
    }
    public function showVolunteer($id)
    {
        $result = $this->donorservice->getVolunterById($id);
        if ($result) {
            return response()->json([
                'success' => true,
                'Volunteer' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch Volunteer Data'
        ], 404);
    }
    public function storeVolunteer(Request $request)
    {
        $result = $this->donorservice->createVolunteer($request);
        if ($result) {
            return response()->json([
                'success' => true,
                'Volunteer' => $result
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'Failed to list as Volunteer'
        ], 404);
    }
}
