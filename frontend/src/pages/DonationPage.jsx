import React from "react";
import { Link } from "react-router-dom";
import { Heart, DollarSign, Droplet, Gift } from "lucide-react";

const DonationPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <header className="bg-[#311B08] text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 flex justify-center items-center gap-2">
          <Heart size={40} className="text-red-500" />
          Donate to Make a Difference
        </h1>
        <p className="text-lg max-w-3xl mx-auto">
          Your generosity can bring hope to those in need. Support disaster relief through financial
          contributions or blood donations and help save lives today. Together, we can rebuild stronger
          communities.
        </p>
      </header>

      <main className="container mx-auto py-16 px-4">
        <h2 className="text-2xl font-semibold text-center mb-8">How you can help:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-[#EBB380] p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
            <DollarSign size={48} className="mx-auto text-[#311B08] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Donate Money</h3>
            <p>Support relief efforts by donating funds to help communities rebuild.</p>
          </div>

          <div className="bg-[#EBB380] p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
            <Droplet size={48} className="mx-auto text-[#311B08] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Donate Blood</h3>
            <p>Help save lives by donating blood for emergency medical needs.</p>
          </div>

          <div className="bg-[#EBB380] p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
            <Gift size={48} className="mx-auto text-[#311B08] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Donate Goods</h3>
            <p>Provide essential items such as food, clothing, and supplies to those affected.</p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default DonationPage;
