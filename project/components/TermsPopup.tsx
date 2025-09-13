import { useState } from "react";

const TermsPopup = ({ isOpen, onClose, onAccept }: any) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept(true); // Send acceptance to parent
      onClose(); // Close the popup
    } else {
      alert("Please accept the Terms and Conditions to proceed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-3xl w-full p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>

        <div className="space-y-4 text-sm">
          {/* Terms content as before */}
          <div>
            <h3 className="font-semibold">Logo & Branding</h3>
            <ul className="list-disc list-inside">
              <li>Must include brand-provided logos and taglines.</li>
              <li>Logos must not be edited, cropped, or modified in any way.</li>
              <li>Everything must be aligned correctly and strategically positioned for maximum impact.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Content Approval</h3>
            <ul className="list-disc list-inside">
              <li>Submit all content (video, image, captions) for approval before publishing.</li>
              <li>No posts allowed without brand confirmation.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Modifications</h3>
            <ul className="list-disc list-inside">
              <li>Every detail matters. We revise and improve until the client is satisfied.</li>
              <li>Our process includes unlimited revisions — because Client satisfaction is our priority.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Posting Requirement</h3>
            <ul className="list-disc list-inside">
              <li>Minimum: 1 Reel + 1 Story.</li>
              <li>Content must be aligned with brand’s suggested storyline/script.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Content Posting</h3>
            <p>It must be posted based on company concern.</p>
          </div>
          <div>
            <h3 className="font-semibold">Insights Sharing</h3>
            <p>Must share story and post insights within 48 hours after posting.</p>
          </div>
          <div>
            <h3 className="font-semibold">Brand Usage Rights</h3>
            <p>Brand may use the influencer’s content for promotions, with credit.</p>
          </div>
          <div>
            <h3 className="font-semibold">Payment Terms & Disbursement Procedure</h3>
            <ul className="list-disc list-inside">
              <li><strong>Payment Schedule:</strong> Full payment within 14 days of invoice submission.</li>
              <li><strong>Bank & Payment Details:</strong> Ensure correct account info to avoid delays.</li>
              <li><strong>Delays & Exceptions:</strong> Any additional verification will be communicated with updated timeline.</li>
              <li><strong>Mode of Payment:</strong> Bank Transfer / UPI / Cheque / as per company.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex items-center">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
            className="mr-2"
          />
          <label htmlFor="acceptTerms" className="text-sm">
            I accept the Terms and Conditions. By registering, you agree to our platform guidelines, content policies, and commission structure. You also consent to profile verification and background checks.
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            className={`px-4 py-2 rounded text-white ${accepted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
            disabled={!accepted}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPopup;
