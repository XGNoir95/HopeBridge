import React from "react";
import { Link } from "react-router-dom";
import { Heart, DollarSign, Droplet, Gift } from "lucide-react";

const DonationPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <header className="bg-[url('/donate.png')] text-white py-16 text-center">
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
        <h2 className="text-3xl font-bold text-center mb-8">How you can help:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Link to="/donate-money">
            <div className="bg-[url('/money.png')] p-6 rounded-lg shadow-lg hover:shadow-2xl transition cursor-pointer">
              <DollarSign size={48} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-white">Donate Money</h3>
              <p className="text-lg text-white">Support relief efforts by donating funds to help communities rebuild.</p>
            </div>
          </Link>

          <Link to="/donate-blood">
            <div className="bg-[url('/blood.png')] p-6 rounded-lg shadow-lg hover:shadow-2xl transition cursor-pointer">
              <Droplet size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Donate Blood</h3>
              <p className="text-lg text-white">Help save lives by donating blood for emergency medical needs.</p>
            </div>
          </Link>

          <Link to="/donate-goods">
            <div className="bg-[url('/goods.png')] p-6 rounded-lg shadow-lg hover:shadow-2xl transition cursor-pointer">
              <Gift size={48} className="mx-auto text-amber-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Donate Goods</h3>
              <p className="text-lg text-white">Provide essential items such as food, clothing, and supplies to those affected.</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DonationPage;