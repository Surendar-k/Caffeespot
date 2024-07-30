import { useEffect, useState } from "react";
import Reviewscard from "../layouts/Reviewscard";
import axios from "axios";
import defaultImage from '../assets/images/defaultavatar.png';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ title: '', review: '', rating: 0, img: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5000/reviews')
            .then(response => {
                setReviews(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
                setError('Error fetching reviews');
                setLoading(false);
            });
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/reviews/${id}`)
            .then(response => {
                if (response.data.success) {
                    setReviews(reviews.filter(review => review.id !== id));
                }
            })
            .catch(error => {
                console.error('Error deleting review:', error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prev => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (newReview.title && newReview.review && newReview.rating >= 0 && newReview.rating <= 5) {
            setLoading(true);
            axios.post('http://localhost:5000/reviews', newReview)
                .then(response => {
                    setReviews([response.data, ...reviews]);
                    setNewReview({ title: '', review: '', rating: 0, img: '' });
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error submitting review:', error);
                    setError('Error submitting review');
                    setLoading(false);
                });
        } else {
            setError('Please fill in all fields with valid data.');
        }
    };

    return (
        <div className='min-h-screen flex flex-col justify-center lg:px-32 px-5 bg-backgroundColor'>
            <h1 className="font-semibold text-center text-4xl lg:mt-14 mt-24">{"Customer's Reviews"}</h1>
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="flex flex-row gap-5 justify-start py-10 my-8 max-h-96 overflow-x-auto">
                {reviews.map((review) => (
                    <Reviewscard 
                        key={review.id}
                        id={review.id}
                        img={review.img || defaultImage}
                        title={review.title}
                        review={review.review}
                        rating={review.rating}
                        onDelete={() => handleDelete(review.id)}
                    />
                ))}
            </div>
            <div className="flex flex-col items-center">
                <h2 className="font-semibold text-2xl mt-10">Submit Your Review</h2>
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 mt-5 w-full lg:w-1/2">
                    <input 
                        type="text" 
                        name="title" 
                        value={newReview.title} 
                        onChange={handleInputChange} 
                        placeholder="Your Title" 
                        className="p-2 border rounded"
                    />
                    <textarea 
                        name="review" 
                        value={newReview.review} 
                        onChange={handleInputChange} 
                        placeholder="Your Review" 
                        className="p-2 border rounded"
                    />
                    <input 
                        type="number" 
                        name="rating" 
                        value={newReview.rating} 
                        onChange={handleInputChange} 
                        placeholder="Rating (0-5)" 
                        className="p-2 border rounded"
                        min="0"
                        max="5"
                        step="0.1"
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Submit Review
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Reviews;
