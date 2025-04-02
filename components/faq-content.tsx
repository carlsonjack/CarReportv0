"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqContent() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqItems = [
    {
      question: "How Can My CarReport Help Me?",
      answer: (
        <p>
          CarReport contains information that can help you decide whether to buy a used vehicle including how much you
          want to pay. Avoid being a victim of fraud or mal-practice by unknowingly purchasing a car that has been
          involved in an accident and then refurbished and re-sold without any disclosure. Use this report as a critical
          decision maker along with a vehicle inspection and test drive to make a better decision about your next used
          car.
        </p>
      ),
    },
    {
      question: "What Is CarReport?",
      answer: (
        <p>
          CarReport compiles thousands of records to provide a detailed history of a used vehicle, all in one
          easy-to-read report. Our data comes from a wide range of sources, including insurance companies,
          manufacturers, and government agencies. Each report includes key details such as vehicle specifications,
          accident history, odometer readings, and market valuations—helping you make an informed buying decision.
        </p>
      ),
    },
    {
      question: "How Long Does It Take to Get My CarReport, and How Will I Receive It?",
      answer: (
        <div>
          <p>
            The report is delivered on screen to you immediately after purchased. You will also receive an email. You
            should save this email for future reference as you will require the reference number to update your check.
          </p>
          <a
            href="/assets/samples/Latest-USA_carreport_sample_report.pdf"
            target="_blank"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 hover:underline"
            rel="noreferrer"
          >
            View Sample Report
          </a>
        </div>
      ),
    },
    {
      question: "What should I do if I have trouble accessing my CarReport results?",
      answer: (
        <div>
          <p>
            First, double-check that the information you entered—such as your personal details and payment
            information—is correct. If your results page doesn't load, wait a few minutes for the report to arrive in
            your email inbox.
          </p>
          <p className="mt-4">
            If you're still experiencing issues, please reach out to us. Our support team is available anytime—just send
            us an email, and we'll get back to you as quickly as possible.{" "}
            <a href="/contact" className="text-blue-600 hover:text-blue-800 hover:underline">
              Contact us
            </a>
          </p>
        </div>
      ),
    },
    {
      question: "What Information Does My CarReport Provide?",
      answer: (
        <div>
          <p>
            The CarReport provides you with the information that has been collected from the many different sources
            about a used vehicle. The amount of information available on each vehicle will vary. The report can include
            the following:
          </p>
          <ul className="list-disc pl-10 py-4 space-y-2">
            <li>Vehicle Specifications (often including factory fitted options)</li>
            <li>Imported vehicle data including Title data such as Salvage, Flooded etc</li>
            <li>Accident Records</li>
            <li>Vehicle Valuation</li>
            <li>Mileage Information</li>
            <li>Links to Best Finance and Insurance Deals</li>
            <li>And many more additional specifications</li>
          </ul>
          <a
            href="/assets/samples/Latest-USA_carreport_sample_report.pdf"
            target="_blank"
            className="inline-block mt-2 text-blue-600 hover:text-blue-800 hover:underline"
            rel="noreferrer"
          >
            View Sample Report
          </a>
        </div>
      ),
    },
    {
      question: "What information is NOT included in my CarReport?",
      answer: (
        <ul className="space-y-3">
          <li>
            <strong>Owner Information:</strong> CarReport does not provide the names or details of a vehicle's previous
            or current owners.
          </li>
          <li>
            <strong>Unreported Accidents:</strong> CarReport only includes accident history if it has been reported to
            one of our trusted data sources.
          </li>
          <li>
            <strong>Service History:</strong> CarReport does not include all details about routine maintenance or
            repairs (yet).
          </li>
          <li>
            <strong>Mechanical Condition:</strong> CarReport does not assess the current mechanical condition of a
            vehicle. If you want a professional evaluation, consider scheduling an independent vehicle inspection with a
            trusted mechanic.
          </li>
        </ul>
      ),
    },
    {
      question: "Where Does CarReport Get Its Data?",
      answer: (
        <div>
          <p>CarReport compiles data from a wide range of trusted sources, including:</p>
          <ul className="space-y-3 mt-4">
            <li>
              <strong>Government records</strong> – Title history, registration details, and reported accidents.
            </li>
            <li>
              <strong>Insurance companies</strong> – Claims, accident reports, and total loss records.
            </li>
            <li>
              <strong>Kelley Blue Book (KBB)</strong> – Trusted vehicle valuation and market pricing data.
            </li>
            <li>
              <strong>Wholesale auction data</strong> – Insights from major dealer auctions, including past sales and
              condition reports.
            </li>
            <li>
              <strong>Salvage & junk records</strong> – Reports on vehicles declared salvage, junked, or written off.
            </li>
            <li>
              <strong>Proprietary CarReport data</strong> – Exclusive insights gathered from various industry sources to
              provide a more complete picture of a vehicle's history.
            </li>
          </ul>
          <p className="mt-4">
            By combining these data sources, CarReport delivers one of the most comprehensive vehicle history reports
            available.
          </p>
        </div>
      ),
    },
    {
      question: 'What Does "No Records Found for This Vehicle" Mean?',
      answer: (
        <p>
          "No records found for this vehicle" indicates that CarReport found no information registered in that category
          at that point in time. This could mean that we have not yet received the data or there are no current
          interests recorded.
        </p>
      ),
    },
    {
      question: "Mileage Concerns",
      answer: (
        <p>
          CarReport searches millions of records in a vast database to detect possible mileage discrepancies or
          tampering. It provides the most reliable data available to help you determine if a vehicle showing 20,000
          miles may have actually traveled 120,000 miles.
        </p>
      ),
    },
    {
      question: "VIN/Chassis Number Match",
      answer: (
        <p>
          If the Vehicle Identification Number (VIN) on the car doesn't match the registration documents, it could be a
          sign of theft or identity fraud. Always verify that the VIN stamped on the body, chassis plate, and visible
          through the windshield matches the paperwork and appears legitimate.
        </p>
      ),
    },
    {
      question: "Vehicle Valuation",
      answer: (
        <p>
          Using industry data and statistical models updated monthly CarReport will indicate the current market value of
          the car you're considering buying.
        </p>
      ),
    },
  ]

  // Filter FAQ items based on search query
  const filteredFaqItems = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof item.answer === "string" && item.answer.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div>
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="search"
          placeholder="Search frequently asked questions..."
          className="pl-10 py-6 text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredFaqItems.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-gray-500">
            We couldn't find any FAQs matching your search. Please try different keywords or{" "}
            <a href="/contact" className="text-blue-600 hover:underline">
              contact us
            </a>{" "}
            for assistance.
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
              <AccordionTrigger className="text-left font-medium py-4 hover:text-blue-600 text-base sm:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pb-6 pt-2">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
        <p className="mb-4">If you couldn't find the answer you were looking for, our support team is here to help.</p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Contact Support
        </a>
      </div>
    </div>
  )
}

