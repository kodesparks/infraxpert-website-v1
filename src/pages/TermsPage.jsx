import React, { useEffect } from 'react'
import { FileText, UserCheck, Scale, ShoppingCart, Truck, CreditCard, AlertTriangle, ShieldAlert, Globe, Calendar, CheckCircle } from 'lucide-react'

const TermsPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sections = [
    { id: 'agreement', title: '1. Agreement to Terms', icon: Scale },
    { id: 'accounts', title: '2. User Accounts & Registration', icon: UserCheck },
    { id: 'pricing', title: '3. Products & Pricing', icon: ShoppingCart },
    { id: 'delivery', title: '4. Delivery & Pincode Serviceability', icon: Truck },
    { id: 'payments', title: '5. Payments & Billing', icon: CreditCard },
    { id: 'cancellation', title: '6. Cancellations & Refunds', icon: AlertTriangle },
    { id: 'prohibited', title: '7. Prohibited Activities', icon: ShieldAlert },
    { id: 'liability', title: '8. Limitation of Liability', icon: Globe }
  ]

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100 // header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header Section */}
      <section className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 py-12 sm:py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Terms of Service
          </h1>
          <div className="flex items-center justify-center text-sm opacity-90 gap-2 font-medium">
            <Calendar className="w-4 h-4" />
            <span>Last Updated on 17/06/2026</span>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Table of Contents */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-950 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map(section => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-blue-600" />
                      <span className="truncate">{section.title}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className="lg:w-3/4 flex-1">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-10 space-y-12">
              
              {/* Introduction */}
              <div className="prose prose-blue max-w-none">
                <div className="p-5 bg-blue-50/50 border border-blue-100/60 rounded-xl mb-6">
                  <p className="text-gray-700 leading-relaxed font-medium mb-4">
                    Please read these Terms of Service carefully before accessing or using the website/App. By accessing or using any part of the site, you agree to be bound by these Terms of Service.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The platform www.infraxpert.co.in (hereinafter referred to as &ldquo;site/App&rdquo; or &ldquo;InfraXpert&rdquo;) is an online marketplace connecting buyers with sellers for construction materials, including cement, steel, TMT bars, iron, ready-mix concrete, and other related services.
                  </p>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* AGREEMENT TO TERMS */}
              <section id="agreement" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Scale className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    By registering an account, purchasing products, or accessing our services, you warrant that you are at least 18 years of age and possess the legal authority to enter into contract.
                  </p>
                  <p>
                    We reserve the right to update, change, or replace any part of these Terms of Service by posting updates and/or changes to our website/App. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website/App following the posting of any changes constitutes acceptance of those changes.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* USER ACCOUNTS & REGISTRATION */}
              <section id="accounts" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">2. User Accounts &amp; Registration</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    To place orders or access specific features, users must sign up and register an account. During registration, you agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate, current, and complete information, including your legal name, company/business name (if applicable), valid email address, phone number, delivery address, and tax statutory registration numbers (such as GST or PAN details).</li>
                    <li>Maintain the security of your password and accept all risks of unauthorized access to your account and the information you provide.</li>
                    <li>Notify us immediately at <a href="mailto:statecoordinator@infraxpert.co.in" className="text-blue-600 hover:underline">statecoordinator@infraxpert.co.in</a> if you discover or suspect any security breaches or unauthorized use of your account.</li>
                  </ul>
                  <p>
                    We reserve the right to suspend or terminate accounts that provide false details or violate our safety guidelines. Account deactivation or deletion requests will be evaluated on a case-by-case basis.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* PRODUCTS & PRICING */}
              <section id="pricing" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">3. Products &amp; Pricing</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    We specialize in premium quality construction materials sourced from top brands and certified vendors.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Availability:</strong> All product listings (OPC & PPC cement grades, TMT bars, structural steel, ready-mix concrete, etc.) are subject to availability.
                    </li>
                    <li>
                      <strong>Pricing:</strong> Prices are dynamic and calculated based on your delivery pincode, stock availability, applicable taxes (GST), dealer margins, and shipping costs from the nearest warehouse.
                    </li>
                    <li>
                      <strong>Modifications:</strong> We reserve the right to change prices and specifications of products without prior notice.
                    </li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* DELIVERY & PINCODE SERVICEABILITY */}
              <section id="delivery" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">4. Delivery &amp; Pincode Serviceability</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    Delivery charge calculations and delivery availability are managed automatically based on the distance between the destination pincode and the nearest stocking warehouse.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Pincode Verification:</strong> Users must submit a valid delivery pincode to check serviceability, nearest warehouse availability, delivery eligibility, and expected shipping duration.
                    </li>
                    <li>
                      <strong>Delivery Charges:</strong> Shipping fees are calculated on a per-kilometer distance from the supplying warehouse. Free delivery may apply if the order value matches or exceeds the specified free delivery threshold and falls within the authorized free delivery radius.
                    </li>
                    <li>
                      <strong>Timeline:</strong> Expected delivery dates are estimates. Delays caused by weather conditions, road access restrictions, labor strikes, or regulatory checks are beyond our control.
                    </li>
                    <li>
                      <strong>Site Accessibility:</strong> It is the buyer's responsibility to ensure that transport vehicles (including trucks, concrete mixers, etc.) have proper, safe, and lawful access to the delivery site.
                    </li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* PAYMENTS & BILLING */}
              <section id="payments" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">5. Payments &amp; Billing</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    All purchases must be paid in full using the permitted payment options prior to order dispatch, unless explicit credit facilities have been granted in writing.
                  </p>
                  <p>
                    You agree to provide current, complete, and accurate purchase and account information for all purchases made on our store. We rely on secure external payment processors for online transactions. InfraXpert does not store or request sensitive banking credentials or payment passwords.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* CANCELLATIONS & REFUNDS */}
              <section id="cancellation" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg text-red-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">6. Cancellations &amp; Refunds</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    Due to the nature of construction materials (including perishable ready-mix concrete and specialized steel cuts):
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Cement and Steel:</strong> Cancellations or modifications to orders are evaluated on a case-by-case basis. Once dispatch has occurred, cancellations will not be accepted.
                    </li>
                    <li>
                      <strong>Ready-Mix Concrete:</strong> Ready-mix concrete orders are custom-batched and cannot be canceled or refunded once loading at the mixing plant has commenced.
                    </li>
                    <li>
                      <strong>Grievances:</strong> In the event of material defects or short shipments, please report the issue within 24 hours of delivery along with photographic proof. All legitimate claims will be processed for replacements or refunds as per the Grievance Officer's assessment.
                    </li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* PROHIBITED ACTIVITIES */}
              <section id="prohibited" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">7. Prohibited Activities</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>In addition to other prohibitions set forth in these Terms, you are prohibited from using the site or its content:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>For any unlawful purpose or to solicit others to perform or participate in any unlawful acts.</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others.</li>
                    <li>To submit false or misleading information.</li>
                    <li>To upload or transmit viruses, malware, or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet.</li>
                    <li>To scrape, crawl, or extract data from the site/App without our express written permission.</li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* LIMITATION OF LIABILITY */}
              <section id="liability" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">8. Limitation of Liability</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    We do not guarantee, represent, or warrant that your use of our service will be uninterrupted, timely, secure, or error-free.
                  </p>
                  <p>
                    In no case shall InfraXpert, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* CONTACT & GRIEVANCE */}
              <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Contact Information
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  If you have any questions about these Terms of Service, please contact our support team at:
                </p>
                <div className="text-sm text-gray-700 font-medium space-y-1">
                  <div>Email Support: <a href="mailto:statecoordinator@infraxpert.co.in" className="text-blue-600 hover:underline">statecoordinator@infraxpert.co.in</a></div>
                  <div>Grievance Officer: <span className="text-gray-950 font-bold">Suresh</span></div>
                </div>
              </section>

            </div>
          </main>

        </div>
      </div>
    </div>
  )
}

export default TermsPage
