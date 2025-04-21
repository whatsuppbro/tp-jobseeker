"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Full Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john.doe@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Subject
              </label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Job inquiry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Message
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Your message here..."
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
            <a
              href="mailto:support@jobtp.com"
              className="text-blue-600 hover:underline"
            >
              support@jobtp.com
            </a>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
            <p>+66 (123) 456-789</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Location</p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.535664941859!2d100.53427788549998!3d13.74653886299582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ecfc2f455e1%3A0xc4ad0280d8906604!2scentralwOrld!5e0!3m2!1sen!2sth!4v1745143199833!5m2!1sen!2sth"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="CentralWorld Location"
              className="rounded-lg shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
