"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PencilRuler, Search, BookOpenCheck } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const responseData = await response.json();

        const jobs = responseData.data || [];

        if (!Array.isArray(jobs)) {
          console.error("API did not return an array:", jobs);
          setFeaturedJobs([]);
          return;
        }

        setFeaturedJobs(jobs.slice(0, 6));
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16 bg-gradient-to-r from-green-700/65 to-emerald-600 text-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
        <p className="text-lg mb-8">
          Discover thousands of opportunities tailored just for you.
        </p>
        <Button
          onClick={() => router.push("/job")}
          size="lg"
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          Explore Jobs
        </Button>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Featured Jobs
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Link
                href={`/job/${job.id}`}
                key={job.id}
                className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105"
              >
                <div key={job.id}>
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">
                    {job.description}
                  </p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Company: {job.company?.company_name || "Not specified"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No featured jobs available at the moment.
          </p>
        )}
        <div className="flex justify-center mt-8">
          <Button onClick={() => router.push("/job")} variant="outline">
            View All Jobs
          </Button>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <PencilRuler className="mx-auto mb-4" size={80} />
            <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
            <p className="text-gray-600">
              Build a professional profile that showcases your skills and
              experience.
            </p>
          </div>
          <div className="text-center">
            <Search className="mx-auto mb-4" size={80} />
            <h3 className="text-xl font-semibold mb-2">Search Jobs</h3>
            <p className="text-gray-600">
              Find jobs that match your skills and preferences.
            </p>
          </div>
          <div className="text-center">
            <BookOpenCheck className="mx-auto mb-4" size={80} />
            <h3 className="text-xl font-semibold mb-2">Apply to Jobs</h3>
            <p className="text-gray-600">
              Submit your application and get hired by top companies.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-semibold text-center mb-8">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 mb-4">
              "I found my dream job in just a week! The platform is amazing."
            </p>
            <p className="text-gray-500 font-semibold">- Jane Doe</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 mb-4">
              "The job search process was smooth and efficient. Highly
              recommend!"
            </p>
            <p className="text-gray-500 font-semibold">- John Smith</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 mb-4">
              "Great platform for both job seekers and employers."
            </p>
            <p className="text-gray-500 font-semibold">- Emily Johnson</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-green-700/65 to-emerald-600 text-white rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to Take the Next Step?
        </h2>
        <p className="text-lg mb-8">
          Join thousands of professionals finding their perfect match today.
        </p>
        <Button
          onClick={() => router.push("/signup")}
          size="lg"
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          Get Started
        </Button>
      </section>
    </div>
  );
}
