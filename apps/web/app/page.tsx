"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Share2, Users, Layers, Star, CircleUserRound, Check, ChevronRight } from 'lucide-react'
import { motion } from "framer-motion"

export default function Home() {
  const features = [
    {
      icon: <Users className="h-10 w-10" />,
      title: "Real-time collboration",
      description: "Work together with your team on the same canvas in real-time, seeing changes as they happen."
    },
    {
      icon: <Share2 className="h-10 w-10" />,
      title: "Easy Sharing",
      description: "Share your drawings with a simple link. Control who can view or edit your work.",
    },
    {
      icon: <Layers className="h-10 w-10" />,
      title: "Infinite canvas",
      description: "Never run out of space with our infinite canvas that expands as you draw.",
    }
  ]

  const prices = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Up to 100 notes",
        "Basic organization",
        "Mobile access",
        "Community support"
      ],
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "For serious thinkers",
      features: [
        "Unlimited notes",
        "Advanced organization",
        "AI-powered insights",
        "Priority support",
        "Custom themes",
        "Export options"
      ],
      buttonText: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Advanced security",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee"
      ],
      buttonText: "Contact Sales"
    }
  ]

  return (
    <div className="bg-black text-white max-w-screen min-h-screen overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }} className="fixed z-50 top-0 left-0 border-y border-white/20 bg-black backdrop-filter backdrop-blur-md bg-transparent w-screen h-22">
        <div
          className="flex justify-between items-center h-full p-8">

          <div className="text-4xl font-bold flex items-center cursor-pointer">Xcal</div>

          <div className="flex items-center gap-6">
            <Link href="#features">
              <div className="hover:underline hover:underline-offset-3 font-semibold transition-all duration-300 hover:-translate-y-1 cursor-pointer">Features</div>
            </Link>
            <Link href="#pricing">
              <div className="hover:underline hover:underline-offset-3 font-semibold transition-all duration-300 hover:-translate-y-1 cursor-pointer">Pricing</div>
            </Link>

            <div className="flex gap-2 mr-4">
              <Link href="/signup">
                <button className="bg-white font-semibold text-black transition-all duration-300 hover:bg-white/80 px-3 py-2 rounded-md cursor-pointer">Signup</button>
              </Link>

              <Link href="/signin">
                <button className="bg-black font-semibold border border-white/30 transition-all duration-300 hover:bg-white/10 px-3 py-2 rounded-md cursor-pointer">Login</button>
              </Link>
            </div>

          </div>
        </div>
      </motion.div>

      <div className="flex justify-between p-5 pt-32 pl-25 pr-25 pb-20 border-b border-white/30">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }} className="flex flex-col pt-5">
          <div className="tracking-wide font-bold text-6xl pb-5">
            Draw and collaborate <br />
            in real-time
          </div>

          <div className=" text-lg text-gray-400 text-justify text-wrap ">
            Create beautiful diagrams, sketches and wireframes with a <br />
            simple, intuitive interface. Share your ideas with your team in <br />
            real-time and bring your concpets to life.
          </div>

          <div className="pt-5 flex ">
            <Link href="/signup">
              <button className="bg-white flex items-center text-black font-medium text-md rounded-md px-3 py-2 flex cursor-pointer hover:bg-white/80 transition-all duration-200">
                Start drawing now <ArrowRight className="pl-2" />
              </button>
            </Link>
            <button
              className="ml-6 bg-black font-medium border flex items-center border-white/30 transition-all duration-300 hover:bg-white/10 px-3 py-2 rounded-md cursor-pointer">
              Watch demo
            </button>
          </div>

          <div className="flex pt-5 text-gray-400">
            <Users className="mr-2" /> 15,000+ teams already using Excal.
          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}>
          <Image className="hover:shadow-lg transition-all duration-200 hover:shadow-white/30" src="https://i.pinimg.com/736x/6e/22/33/6e22335dfb94c453afefc69cb46528f2.jpg" alt="image" width={400} height={500} />
        </motion.div>
      </div>


      <div id="features" className="pb-30 border-b bg-white/10 text-white border-white/30">
        <h1 className="font-bold text-5xl pt-15 pl-15 mr-18 flex justify-center">Powerful features for creative minds</h1>
        <p className="mr-18 pt-5 text-gray-400 flex justify-center text-xl text-center">Everything you need to bring your ideas to life, collaborate with others, <br />
          and share your vision.</p>
        <div className="flex gap-12 justify-center pt-5">

          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 40 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className="bg-black border border-white/30 text-white/90 p-4 w-82 rounded-md transition-all 
              duration-300 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-1"
            >
              <div className="w-fit pb-6 p-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold pb-4">{feature.title}</h3>
              <p className="text-gray-400 text-wrap">{feature.description}</p>

            </motion.div>
          ))}

        </div>
      </div>


      {/* <div id="testimonials" className="pt-15 pb-20 border-b border-white/30 ">
        <h1 className="flex justify-center mr-25 text-5xl font-bold pb-5">Loved by teams worldwide</h1>
        <p className="flex justify-center mr-25 text-xl text-gray-400 ">See what our users say about their experience with Excal.</p>

        <div className="flex justify-center pt-10 gap-8">
          {testimonial.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className="bg-black border border-white/30 text-white/90 p-6 w-102 rounded-md transition-all 
              duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-600 text-yellow-600 mb-4" />
                ))}
              </div>
              <div className="text-lg pb-6">&ldquo;{testimonial.quote}&rdquo;</div>
              <div className="text-md flex items-center">
                <CircleUserRound className="m-2" />
                <div className="flex flex-col">
                  {testimonial.author}
                  <div className="text-sm font-thin">{testimonial.role}</div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div> */}


      <div id="pricing" className="pt-15 pb-20 border-b border-white/30">

        <div className="text-5xl font-bold flex justify-center pb-15">
          Pricing
        </div>

        <div className="flex gap-8 justify-center">
          {prices.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className={`bg-black text-white p-8 rounded-lg flex flex-col w-78
                  ${tier.popular ? "shadow-md shadow-white/30 border-1 border-white/70 hover:shadow-lg transition-all duration-300"
                  : "hover:shadow-white/40 border border-white/30 duration-300 transition-all hover:shadow-md duration-300"}`}
            >
              {tier.popular && (
                <div className="rounded-full w-fit text-sm mb-4 px-3 py-1 bg-white text-black font-medium">
                  Most popular
                </div>
              )}
              <h3 className="font-medium">{tier.name}</h3>
              <div className="flex items-baseline mb-4 ">
                <span className="text-4xl font-light">{tier.price}</span>
                {tier.period && <span className="text-lg text-gray-400 ml-1">{tier.period}</span>}
              </div>
              <p className=" mb-6 text-gray-400">{tier.description}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 " />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <button className={`hover:-translate-y-1 px-2 py-1 rounded-md w-full duration-300 font-medium cursor-pointer
                ${tier.popular ? "bg-white text-black hover:bg-white/80" : "border border-white/30 hover:bg-white/10"}`}>{tier.buttonText}</button>
              </Link>

            </motion.div>

          ))}
        </div>
      </div>

      <div className="pt-15 pb-20 border border-white/30 bg-white text-black flex ">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }} className="pl-25">
          <h1 className="text-4xl font-bold pb-6">Ready to bring your ideas to life?</h1>
          <p className="text-gray-600 text-lg">Join thousands of teams who use Excal to collaborate, ideate,
            <br /> and create amazing visuals together</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }} className="flex jusify-center items-center pl-15 gap-8">
          <button className="cursor-pointer bg-black/90 text-white rounded-md px-4 py-2 hover:bg-black/80 duration-300 transition-all flex items-center ">
            Start for free <ChevronRight size="20" className="ml-1" />
          </button>
          <button className="bg-white cursor-pointer hover:bg-black/20 text-black rounded-md px-4 py-2 border border-black/30 duration-300 transition-all">See live demo</button>
        </motion.div>

      </div>

      {/* <div className="pt-10 pb-15 border border-white/30">

        <div className="grid grid-cols-4 gap-8">
          <div className="pl-8">
            <h2 className="font-bold text-2xl pb-4">Excal</h2>
            <p className="text-gray-400 text-md">Create beautiful digrams, sketches, and wireframes with a simple , intuitive interface</p>
          </div>

          {footer.map((column, index) => (
            <div key={index} className="cursor-pointer">
              <h3 className="font-semibold pb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, i) => (
                  <li key={i}>
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

      </div> */}


    </div >
  );
}
