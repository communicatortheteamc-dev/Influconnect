const PrivacyPolicyPage = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#000631]">Privacy Policy</h1>
            <p className="mb-4 text-gray-700">
                At InfluConnect, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you use our platform.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-[#000631]">Information We Collect</h2>
            <ul className="list-disc list-inside mb-4 text-gray-700">
                <li><strong>Personal Information:</strong> We may collect personal information such as your name, email address, phone number, and social media profiles when you register on our platform or contact us.</li>
                <li><strong>Usage Data:</strong> We automatically collect information about how you interact with our platform, including your IP address, browser type, pages visited, and the time and date of your visit.</li>
                <li><strong>Cookies:</strong> We use cookies to enhance your experience on our platform. Cookies are small data files stored on your device that help us remember your preferences and improve site functionality.</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4 text-[#000631]">How We Use Your Information</h2>
            <ul className="list-disc list-inside mb-4 text-gray-700">
                <li><strong>To Provide Services:</strong> We use your information to connect brands with influencers, facilitate campaigns, and deliver the services you request.</li>
                <li><strong>To Improve Our Platform:</strong> We analyze usage data to understand how our platform is used and to enhance its features and performance.</li>
                <li><strong>To Communicate:</strong> We may use your contact information to send you updates, newsletters, and promotional materials. You can opt-out of these communications at any time.</li>

                <li><strong>To Ensure Security:</strong> We implement security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-[#000631]">Sharing Your Information</h2>
            <p className="mb-4 text-gray-700">
                We do not sell, trade, or rent your personal information to third parties. However, we may share your information with trusted partners who assist us in operating our platform and providing services, as long as they agree to keep your information confidential.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-[#000631]">Your Choices</h2>
            <ul className="list-disc list-inside mb-4 text-gray-700">
                <li><strong>Access and Update:</strong> You have the right to access and update your personal information at any time by logging into your account.</li>
                <li><strong>Cookie Preferences:</strong> You can manage your cookie preferences through your browser settings. However, disabling cookies may affect the functionality of our platform.</li>
                <li><strong>Opt-Out:</strong> You can opt-out of receiving promotional communications from us by following the unsubscribe link in our emails.</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-[#000631]">Data Security</h2>
            <p className="mb-4 text-gray-700">
                We take the security of your personal information seriously and implement appropriate technical and organizational measures to protect it. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-[#000631]">Changes to This Privacy Policy</h2>
            <p className="mb-4 text-gray-700">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we are protecting your information.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-[#000631]">Contact Us</h2>
            <p className="mb-4 text-gray-700">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at <a href="mailto:"
                    className="text-[#EC6546] underline">
                </a>
            </p>
        </div>
    )
}

export default PrivacyPolicyPage;