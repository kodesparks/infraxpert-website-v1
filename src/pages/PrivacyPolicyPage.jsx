import React, { useEffect } from 'react'
import { Shield, Lock, Eye, Users, FileText, Cookie, Baby, Globe, HelpCircle, User, Calendar } from 'lucide-react'

const PrivacyPolicyPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sections = [
    { id: 'collection', title: 'Collection of Information', icon: Eye },
    { id: 'purpose', title: 'Purpose & Usage', icon: FileText },
    { id: 'disclosure', title: 'Disclosure of Information', icon: Users },
    { id: 'protection', title: 'Protection of Information', icon: Lock },
    { id: 'cookies', title: 'Cookies Policy', icon: Cookie },
    { id: 'children', title: 'Children\'s Privacy', icon: Baby },
    { id: 'transfers', title: 'Data Transfers', icon: Globe },
    { id: 'contact', title: 'Questions & Grievances', icon: HelpCircle }
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
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Privacy Policy
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
                    All the users must read and understand this Privacy Policy as it has been formulated to safeguard the user’s privacy. This Privacy Policy also outlines the ways the users can ensure protection of their personal identifiable information.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You must accept the contents of this Policy in order to use or continue using our website/App. This Privacy Policy detailed here in is also applicable to user of the site or mobile application through mobile or any other similar device.
                  </p>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">
                  The Privacy Policy of <strong>www.infraxpert.co.in</strong> (hereinafter referred to as &ldquo;site/App&rdquo;) detailed herein below governs the collection, possession, storage, handling and dealing of personal identifiable information/data and sensitive personal data (hereinafter collectively referred to as &ldquo;information&rdquo;) of the users of the site/App.
                </p>
              </div>

              <hr className="border-gray-100" />

              {/* COLLECTION OF INFORMATION */}
              <section id="collection" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">COLLECTION OF INFORMATION</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    We confirm that we collect those information from you which is required to extend the services available on the website/App.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      At the time of signing up and registration with the site/App, we collect user information including name, company name, email address, phone/mobile number, postal address and other business information which may also include business statutory details and tax registration numbers.
                    </li>
                    <li>
                      In this regard, we may also record conversations and archive correspondence between users and the representatives of the site/App (including the additional information, if any) in relation to the services for quality control or training purposes.
                    </li>
                    <li>
                      In case of paid packages we may collect personal information of a more sensitive nature which includes bank account numbers and related details to facilitate the sale or purchase of the services available on the site/App.
                    </li>
                    <li>
                      We also gathers and stores the user’s statistics such as IP addresses, pages viewed, user behaviour pattern, number of sessions and unique visitors, browsing activities, browser software operating system etc. for analysis, which helps us to provide improved experience and value added services to you.
                    </li>
                  </ul>
                  <p>
                    Once a user registers, the user is no longer anonymous to us and thus all the information provided by you shall be stored, possessed in order to provide you with the requested services and as may be required for compliance with statutory requirements.
                  </p>
                  <p>
                    User’s registration with us and providing information is intended for facilitating the users in its business.
                  </p>
                  <p>
                    We retains user provided Information for as long as the Information is required for the purpose of providing services to you or where the same is required for any purpose for which the Information can be lawfully processed or retained as required under any statutory enactments or applicable laws.
                  </p>
                  <p>
                    User may update, correct, or confirm provided information by logging on to their accounts on the site/App or by sending a request to <a href="mailto:statecoordinator@infraxpert.co.in" className="text-blue-600 hover:underline">statecoordinator@infraxpert.co.in</a>. The requested changes may take reasonable time due to verification process and server cache policies. In case you would like to receive a copy of our information held by us for porting to another service, please contact us with your request at the email address above.
                  </p>
                  <p>
                    Users may also choose to delete or deactivate their accounts on the site/App. We will evaluate such requests on a case-to-case basis and take the requisite action as per applicable law. In this regard, please note that information sought to be deleted may remain with us in archival records for the purpose of compliance of statutory enactments, or for any other lawful purpose. Therefore, users are requested to carefully evaluate what types of information they would like to provide to us at the time of registration.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* PURPOSE AND USAGE OF INFORMATION */}
              <section id="purpose" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">PURPOSE AND USAGE OF INFORMATION</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>The following are the purposes of collecting the Information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>For the verification of your identity, eligibility, registration and to provide customized services.</li>
                    <li>For facilitating the services offered/available on the site/App.</li>
                    <li>For advertising, marketing, displaying & publication.</li>
                    <li>For enabling communication with the users of the site/App, so that the users may fetch maximum business opportunities.</li>
                    <li>For generating business enquires and trade leads.</li>
                    <li>For sending communications, notifications, newsletters and customized mailers etc.</li>
                  </ul>
                  <p className="bg-yellow-50 border border-yellow-100/60 p-4 rounded-xl text-yellow-900 text-sm">
                    Please get in touch with us at the above email address in case you would like to object to any purpose of data processing. However, please note that if you object or withdraw consent to process data as above, we may discontinue providing you with services through our site/App.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* DISCLOSURE OF INFORMATION */}
              <section id="disclosure" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">DISCLOSURE OF INFORMATION</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    Information we may collect from you may be disclosed and transferred to external service providers who we rely on to provide services to us or to you directly. For instance, information may be shared with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Affiliated companies</strong> for better efficiency, more relevancy, innovative business matchmaking and better personalised services.
                    </li>
                    <li>
                      <strong>Government or regulatory or law enforcement agencies</strong>, as mandated under statutory enactment, for verification of identity or for prevention, detection, investigation including cyber incidents, prosecution and punishment of offences.
                    </li>
                    <li>
                      <strong>Service provider</strong> including but not limited to payment, customer and cloud computing service provider (&ldquo;Third Party&rdquo;) engaged for facilitating service requirements of user.
                    </li>
                    <li>
                      <strong>Business partners</strong> for sending their business offers to the users, which are owned and offered by them solely without involvement of the site/App.
                    </li>
                  </ul>
                  <p>
                    Links to the websites of any of the above may be available on the site as a convenience to user(s) and the site does not have any control over such websites. The usage of such websites by the user will be governed by their respective Privacy Policies and the present Privacy Policy will not apply to usage of such websites. The users of such websites are cautioned to read the privacy policies of such websites.
                  </p>
                  <p>
                    Please get in touch with us at the above email address in case you would like to object to any purpose of data processing. However, please note that if you object or withdraw consent to process data as above, we may discontinue providing you with services through our site/App.
                  </p>
                  <p>In relation to such disclosures, receiving parties have consented and confirmed that:</p>
                  <ul className="list-decimal pl-6 space-y-2">
                    <li>
                      There shall be limited disclosure of any Information to its Directors, officers, employees, agents or representatives who have a need to know such Information in connection with the business transaction and are only permitted to use your Information in connection with the said purpose,
                    </li>
                    <li>
                      They shall keep the Information confidential and secure by using a reasonable degree of care, and
                    </li>
                    <li>
                      They shall not disclose any Information received by them further and must abide by the Privacy Policy of the site/App.
                    </li>
                  </ul>
                  <p className="text-sm italic text-gray-500">
                    Please keep in mind that whenever a user post personal & business information online, the same becomes accessible to the public and the users may receive messages/emails from visitors of the site/App.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* REASONABLE PROTECTION OF INFORMATION */}
              <section id="protection" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">REASONABLE PROTECTION OF INFORMATION</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    We employ commercially reasonable and industry-standard security measures to prevent unauthorized access, maintain data accuracy and ensure proper use of information we receive.
                  </p>
                  <p>
                    These security measures are both electronic as well as physical but at the same time no data transmission over the Internet can be guaranteed to be 100% secure. We strive to protect the User Information, although we cannot ensure the security of Information furnished/transmitted by the users to us.
                  </p>
                  <p className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-900 text-sm font-medium">
                    We recommend you not to disclose password of your email address, online bank transaction and other important credentials to our employees / agents / affiliates/ personnel, as we do not ask for the same.
                  </p>
                  <p>
                    We recommend that registered users not to share their site’s account password and also to sign out of their account when they have completed their work. This is to ensure that others cannot access Information of the users and correspondence, if the user shares the computer with someone else or is using a computer in a public place.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* COOKIES */}
              <section id="cookies" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <Cookie className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">COOKIES</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    We, and third parties with whom we partner, may use cookies, pixel tags, web beacons, mobile device IDs, &ldquo;flash cookies&rdquo; and similar files or technologies to collect and store information in respect to your use of the site and track your visits to third party websites.
                  </p>
                  <p>
                    We also use cookies to recognize your browser software and to provide features such as recommendations and personalization.
                  </p>
                  <p>
                    Third parties whose products or services are accessible or advertised through the site/App, including social media sites, may also use cookies or similar tools, and we advise you to check their privacy policies for information about their cookies and the practices followed by them. We do not control the practices of third parties and their privacy policies govern their interactions with you.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* DATA COLLECTION RELATING TO CHILDREN */}
              <section id="children" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                    <Baby className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">DATA COLLECTION RELATING TO CHILDREN</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    We strongly believe in protecting the privacy of children. In line with this belief, we do not knowingly collect or maintain Personally Identifiable Information on our Site from persons under 18 years of age, and no part of our Site/App is directed to persons under 18 years of age. If you are under 18 years of age, then please do not use or access our services at any time or in any manner.
                  </p>
                  <p>
                    We will take appropriate steps to delete any Personally Identifiable Information of persons less than 18 years of age that has been collected on our Site without verified parental consent upon learning of the existence of such Personally Identifiable Information.
                  </p>
                  <p>
                    If we become aware that a person submitting personal information is under 18, we will delete the account and all related information as soon as possible. If you believe we might have any information from or about a child under 18 please contact us at <a href="mailto:statecoordinator@infraxpert.co.in" className="text-blue-600 hover:underline">statecoordinator@infraxpert.co.in</a>.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* DATA TRANSFERS */}
              <section id="transfers" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">DATA TRANSFERS</h2>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    User Information that we collect may be transferred to, and stored at, any of our affiliates, partners or service providers which may be inside or outside the country you reside in. By submitting your personal data, you agree to such transfers.
                  </p>
                  <p>
                    Your Personal Information may be transferred to countries that do not have the same data protection laws as the country in which you initially provided the information. When we transfer or disclose your Personal Information to other countries, we will protect that information as described in this Privacy Policy. Where relevant, we will ensure appropriate contractual safeguards to ensure that your information is processed with the highest standards of transparency and fairness.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* QUESTIONS & GRIEVANCE OFFICER */}
              <section id="contact" className="scroll-mt-28 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">QUESTIONS &amp; GRIEVANCES</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* General Questions */}
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl space-y-3">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                      Questions
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Please contact us regarding any questions, clarifications, or grievances.
                    </p>
                    <div className="pt-2">
                      <a
                        href="mailto:statecoordinator@infraxpert.co.in"
                        className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Email Support
                      </a>
                    </div>
                  </div>

                  {/* Grievance Officer */}
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl space-y-3">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-violet-600" />
                      Grievance Officer
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      In accordance with the applicable laws, the name and details of the Grievance officer are provided below:
                    </p>
                    <div className="text-sm font-medium text-gray-800 space-y-1">
                      <div>Name: <span className="text-gray-950 font-bold">Suresh</span></div>
                      <div>Email: <a href="mailto:statecoordinator@infraxpert.co.in" className="text-blue-600 hover:underline">statecoordinator@infraxpert.co.in</a></div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100/60 p-5 rounded-2xl text-gray-700 leading-relaxed text-sm">
                  <h4 className="font-bold text-gray-900 mb-2">CHANGES IN PRIVACY POLICY</h4>
                  <p>
                    The policy may change from time to time, so users are requested to check it periodically.
                  </p>
                </div>
              </section>

            </div>
          </main>

        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
