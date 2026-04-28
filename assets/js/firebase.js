import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDgrM9NWE5V9p650ErlEwePhZn8_O9tqlk",
  authDomain: "portfolio-4b982.firebaseapp.com",
  projectId: "portfolio-4b982",
  storageBucket: "portfolio-4b982.firebasestorage.app",
  messagingSenderId: "52702222077",
  appId: "1:52702222077:web:f705b36ff76ad18f94d094",
  measurementId: "G-ZK7SDWVFNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch and Render Reviews
const reviewsContainer = document.getElementById('reviewsContainer');

if (reviewsContainer) {
  const reviewsQuery = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
  
  onSnapshot(reviewsQuery, (snapshot) => {
    reviewsContainer.innerHTML = ''; // clear loading state
    
    if (snapshot.empty) {
      reviewsContainer.innerHTML = '<div class="col-12 text-center"><p style="color: var(--text-muted);">No reviews yet. Be the first to leave one!</p></div>';
      return;
    }

    let delay = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      const starsHtml = '<i class="bi bi-star-fill"></i>'.repeat(data.rating || 5);
      const initial = data.name ? data.name.charAt(0).toUpperCase() : 'A';
      
      const cardHTML = `
        <div class="col-lg-4" data-aos="fade-up" data-aos-delay="${delay}">
          <div class="review-card">
            <div class="review-stars">
              ${starsHtml}
            </div>
            <p class="review-text">"${data.text}"</p>
            <div class="review-author">
              <div class="review-avatar">${initial}</div>
              <div class="review-author-info">
                <h6>${data.name}</h6>
                <small>Verified Review</small>
              </div>
            </div>
          </div>
        </div>
      `;
      reviewsContainer.innerHTML += cardHTML;
      delay += 100;
      if (delay > 300) delay = 0; // reset delay for staggered animation
    });
  }, (error) => {
    console.error("Error fetching reviews:", error);
    reviewsContainer.innerHTML = '<div class="col-12 text-center"><p style="color: #ff4d4d;">Failed to load reviews. Please check database permissions.</p></div>';
  });
}

// Handle Form Submission
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitReviewBtn');
    const statusDiv = document.getElementById('formStatus');
    const originalText = submitBtn.innerText;
    
    submitBtn.innerText = 'Posting Review...';
    submitBtn.disabled = true;
    
    // Get values
    const ratingElement = document.querySelector('input[name="rating"]:checked');
    const rating = ratingElement ? parseInt(ratingElement.value) : 5;
    const name = document.getElementById('reviewName').value;
    const text = document.getElementById('reviewText').value;
    
    try {
      await addDoc(collection(db, "reviews"), {
        rating: rating,
        name: name,
        text: text,
        createdAt: serverTimestamp()
      });
      
      statusDiv.innerHTML = '<span style="color: #00d4aa;"><i class="bi bi-check-circle-fill"></i> Review posted instantly!</span>';
      statusDiv.style.display = 'block';
      reviewForm.reset();
      
      // Close modal after 2 seconds
      setTimeout(() => {
        const modalEl = document.getElementById('reviewModal');
        // Check if bootstrap is available globally
        if (typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
        statusDiv.style.display = 'none';
      }, 2000);
      
    } catch (e) {
      console.error("Error adding document: ", e);
      statusDiv.innerHTML = '<span style="color: #ff4d4d;"><i class="bi bi-exclamation-triangle-fill"></i> Error posting review. Ensure Firestore rules are set to Test Mode.</span>';
      statusDiv.style.display = 'block';
    } finally {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });
}
