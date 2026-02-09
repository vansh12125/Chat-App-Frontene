import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="w-full flex justify-center mt-16">
      <div className="w-full max-w-xl backdrop-blur-2xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl">

        <h1 className="text-4xl font-bold text-white mb-3 text-center">
          Get in Touch
        </h1>

        <p className="text-gray-300 text-center mb-8">
          We'd love to hear from you. Reach us anytime.
        </p>
        <div className="flex flex-col gap-5">

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <Mail className="text-blue-400" size={24} />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white font-medium">
                Vanshsahu6752@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <Phone className="text-green-400" size={24} />
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-white font-medium">
                +91 94512 41142
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <MapPin className="text-pink-400" size={24} />
            <div>
              <p className="text-sm text-gray-400">Location</p>
              <p className="text-white font-medium">
                India
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
