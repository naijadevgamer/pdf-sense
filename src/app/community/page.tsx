// app/community/page.tsx
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Users,
  MessageCircle,
  Star,
  TrendingUp,
  Calendar,
  Award,
  Sparkles,
  GitBranch,
  Heart,
  Share2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

const communityStats = [
  { value: "10,000+", label: "Active Members" },
  { value: "25,000+", label: "Discussions" },
  { value: "100+", label: "Countries" },
  { value: "24/7", label: "Active Community" },
];

const featuredDiscussions = [
  {
    title: "Advanced PDF analysis techniques",
    author: "Sarah Chen",
    replies: 42,
    likes: 128,
    category: "Advanced Usage",
    time: "2 hours ago",
  },
  {
    title: "How to optimize API calls for better performance",
    author: "Marcus Johnson",
    replies: 23,
    likes: 87,
    category: "Development",
    time: "5 hours ago",
  },
  {
    title: "Share your PDFSense success stories!",
    author: "Emily Rodriguez",
    replies: 56,
    likes: 204,
    category: "Community",
    time: "1 day ago",
  },
  {
    title: "Tutorial: Building a document analysis dashboard",
    author: "Alex Thompson",
    replies: 31,
    likes: 95,
    category: "Tutorials",
    time: "2 days ago",
  },
];

const upcomingEvents = [
  {
    title: "PDFSense Community Meetup",
    date: "June 15, 2024",
    time: "2:00 PM EST",
    type: "Virtual",
    attendees: 120,
  },
  {
    title: "API Workshop: Advanced Integration",
    date: "June 22, 2024",
    time: "10:00 AM PST",
    type: "Live Stream",
    attendees: 85,
  },
  {
    title: "Q&A with PDFSense Developers",
    date: "July 5, 2024",
    time: "3:00 PM UTC",
    type: "AMA Session",
    attendees: 200,
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <section className="relative overflow-hidden py-20">
        <MaxWidthWrapper>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6"
            >
              <Users className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join the
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                PDFSense Community
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with fellow developers, share knowledge, and get inspired
              by what others are building with PDFSense.
            </p>
          </motion.div>

          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {communityStats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Featured Discussions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Featured Discussions
              </h2>
              <div className="space-y-4">
                {featuredDiscussions.map((discussion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {discussion.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {discussion.time}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {discussion.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          by {discussion.author}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {discussion.replies} replies
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {discussion.likes} likes
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            {event.date} • {event.time}
                          </p>
                          <p>
                            {event.type} • {event.attendees} attending
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="sm">
                      Register Now
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Community Leaders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Community Leaders
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Chen", role: "Top Contributor", awards: 12 },
                    { name: "Marcus Johnson", role: "API Expert", awards: 8 },
                    {
                      name: "Emily Rodriguez",
                      role: "Community Moderator",
                      awards: 15,
                    },
                  ].map((leader, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {leader.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {leader.name}
                        </p>
                        <p className="text-sm text-gray-600">{leader.role}</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Award className="h-4 w-4" />
                        <span className="text-sm">{leader.awards}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Ready to join the community?
              </h2>
              <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                Connect with other developers, share your projects, and get
                expert help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  variant="secondary"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  <Link href="/sign-up">
                    Join Now
                    <Users className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-gray-900 hover:text-white hover:bg-white/10"
                >
                  <Link href="/docs">
                    View Guidelines
                    <BookOpen className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
