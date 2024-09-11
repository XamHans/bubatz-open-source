export default function PrivacyPolicyPage() {
  return (
    <main className="m-auto my-10 max-w-3xl space-y-5 px-3">
      <h1 className="mb-5 text-3xl font-bold">Privacy Policy</h1>
      <GeneralDataProcessingNotice />
      <DataCollection />
      <DataSecurity />
      <YourRights />
    </main>
  );
}

function GeneralDataProcessingNotice() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">1. General Information</h2>
      <p className="mb-4">
        We are committed to protecting your privacy and personal data. This privacy policy explains how we collect, use, and protect your personal information when you use our website.
      </p>
      <p className="mb-4">
        Personal data refers to any information relating to an identified or identifiable natural person. This includes information such as your email address.
      </p>
      <p className="mb-4">
        We process your data in accordance with applicable data protection laws, including the General Data Protection Regulation (GDPR).
      </p>
    </section>
  );
}

function DataCollection() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">2. Data Collection and Use</h2>
      <p className="mb-4">
        We collect and use only your email address for the purpose of authentication when you use our learning management system. This is necessary to provide you with access to our services and to ensure the security of your account.
      </p>
      <p className="mb-4">
        The legal basis for processing your email address is Article 6(1)(b) of the GDPR, as it is necessary for the performance of a contract to which you are a party or to take steps at your request prior to entering into a contract.
      </p>
      <p className="mb-4">
        We do not use your email address for any other purpose, such as marketing, unless you have explicitly consented to such use.
      </p>
      <p className="mb-4">
        Your email address will be stored for as long as you maintain an active account with our service. If you choose to delete your account, your email address will be removed from our active databases.
      </p>
    </section>
  );
}

function DataSecurity() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">3. Data Security</h2>
      <p className="mb-4">
        We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>Encryption of your email address in our database</li>
        <li>Regular security assessments and updates of our systems</li>
        <li>Limiting access to your personal data to authorized personnel only</li>
      </ul>
      <p className="mb-4">
        While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
      </p>
    </section>
  );
}

function YourRights() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">4. Your Rights</h2>
      <p className="mb-4">
        Under the GDPR, you have the following rights regarding your personal data:
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>The right to access the personal data we hold about you</li>
        <li>The right to rectification if the personal data we hold about you is inaccurate or incomplete</li>
        <li>The right to erasure of your personal data in certain circumstances</li>
        <li>The right to restrict processing of your personal data</li>
        <li>The right to data portability</li>
        <li>The right to object to processing of your personal data</li>
      </ul>
      <p className="mb-4">
        If you wish to exercise any of these rights, please contact us using the contact information provided at the end of this policy.
      </p>
      <p className="mb-4">
        You also have the right to lodge a complaint with a supervisory authority if you believe that our processing of your personal data infringes the GDPR.
      </p>
    </section>
  );
}
