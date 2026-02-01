import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calculator, Truck, Shield, Headphones, Clock, FileText, MapPin, Users, Award } from 'lucide-react'

const ServicesPage = () => {
  const services = [
    {
      id: 1,
      title: "Material Estimation",
      description: "Expert calculation of material requirements for your project with accurate quantity estimates.",
      icon: Calculator,
      features: ["Detailed BOQ preparation", "Quantity optimization", "Cost analysis", "Project planning support"],
      price: "Free Consultation",
      badge: "Popular"
    },
    {
      id: 2,
      title: "Logistics Support",
      description: "Comprehensive transportation and delivery solutions to ensure materials reach your site on time.",
      icon: Truck,
      features: ["Multi-modal transport", "Real-time tracking", "Just-in-time delivery", "Warehouse management"],
      price: "Custom Pricing",
      badge: "Essential"
    },
    {
      id: 3,
      title: "Quality Assurance",
      description: "Rigorous quality testing and certification to guarantee materials meet industry standards.",
      icon: Shield,
      features: ["Third-party testing", "Quality certification", "Compliance verification", "Documentation support"],
      price: "Included",
      badge: "Standard"
    },
    {
      id: 4,
      title: "Technical Consultation",
      description: "Expert technical guidance and consultation for your construction projects and material selection.",
      icon: Headphones,
      features: ["24/7 support", "Expert engineers", "Project consultation", "Material selection"],
      price: "Free",
      badge: "Premium"
    },
    {
      id: 5,
      title: "Just-in-Time Delivery",
      description: "Timely delivery coordination to match your construction schedule and minimize storage costs.",
      icon: Clock,
      features: ["Schedule coordination", "Storage optimization", "Cost reduction", "Project efficiency"],
      price: "Custom Pricing",
      badge: "Advanced"
    },
    {
      id: 6,
      title: "Coming Soon",
      description: "will be available soon.",
      icon: FileText,
      features: ["Compliance documents", "Quality certificates", "Project records", "Audit support"],
      price: "Included",
      badge: "Standard"
    }
  ]

  const stats = [
    { icon: MapPin, value: "11K+", label: "Pincodes Served" },
    { icon: Users, value: "1000+", label: "Happy Clients" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Truck, value: "24/7", label: "Delivery Support" }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services & Features</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Beyond supplying materials, we provide comprehensive services to support your construction 
          projects from planning to completion.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {services.map((service) => (
          <Card key={service.id} className="relative hover:shadow-lg transition-shadow">
            {service.badge && (
              <Badge className="absolute top-4 right-4" variant={
                service.badge === "Popular" ? "default" : 
                service.badge === "Premium" ? "secondary" : "outline"
              }>
                {service.badge}
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  {/* Price hidden: <div className="text-sm font-semibold text-blue-600">{service.price}</div> */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{service.description}</CardDescription>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700">Features:</h4>
                <ul className="space-y-1">
                  {service.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      {/* <div className="text-center">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg">
              Choose the services that best fit your project requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Free Consultation
              </Button>
              <Button size="lg" variant="outline">
                Download Brochure
              </Button>
              <Button size="lg" variant="outline">
                View Case Studies
              </Button>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  )
}

export default ServicesPage
