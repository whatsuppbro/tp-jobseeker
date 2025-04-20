import Link from "next/link";
export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12 border space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Connecting Talent with Opportunity
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            quis quasi porro ab sequi veniam, vitae, omnis rem quaerat
            necessitatibus velit. Quo, inventore nobis? Non, eos vel? Ad, earum
            quibusdam.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y ">
          {[
            "1+ Members",
            "1+ Companies",
            "100% Success Rate",
            "Local Reach",
          ].map((stat) => (
            <div key={stat} className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {stat.replace(/[^0-9]/g, "") || "🌍"}
              </div>
              <div className="text-sm text-gray-600">
                {stat.replace(/[0-9+%]/g, "")}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Our Platform Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Job Matching",
                desc: "AI-powered job recommendations based on your skills and preferences",
                icon: "🔍",
              },
              {
                title: "Career Development",
                desc: "Personalized learning paths and skill assessments",
                icon: "📈",
              },
              {
                title: "Company Insights",
                desc: "Detailed company profiles and culture matches",
                icon: "🏢",
              },
              {
                title: "Application Tracking",
                desc: "Manage all your job applications in one place",
                icon: "📋",
              },
              {
                title: "Salary Tools",
                desc: "Real-time market salary data and negotiation help",
                icon: "💸",
              },
              {
                title: "Community Support",
                desc: "Connect with mentors and industry professionals",
                icon: "🤝",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 py-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam,
              assumenda ea facere, quos consectetur maxime molestiae error eos
              perspiciatis minus, natus vel repudiandae sint odit consequuntur
              fugit eum deserunt eveniet.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui
              facere nam saepe magnam sint delectus sunt expedita commodi earum
              tempora velit, architecto eos voluptatem debitis, asperiores
              consequatur repudiandae ducimus quia?
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Leadership Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Natee, CEO",
              "Punnavut, CTO",
              "Michael Jackson, Billie Jean",
            ].map((member) => (
              <Link href="https://www.github.com/" key={member}>
                <div
                  key={member}
                  className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src="https://as1.ftcdn.net/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
                    alt={member}
                    className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"
                  />
                  <h4 className="text-xl font-semibold mb-2">
                    {member.split(",")[0]}
                  </h4>
                  <p className="text-gray-500">{member.split(",")[1]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-700/65 to-emerald-600 text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready for Your Next Career Move?
          </h3>
          <p className="mb-6">
            Join our growing community of professionals and innovators
          </p>
          <Link href="/job">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
              Explore Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
