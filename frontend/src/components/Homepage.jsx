'use client'

import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { db } from "@/firebase/config";
import { getDocs, query, where, collection, addDoc, updateDoc, doc } from "firebase/firestore";
import axios from 'axios';
import { obfuscatePortion } from 'text-obfuscation'; // Import the text-obfuscation library

// Function to check if the link matches the Telegram format
const isTelegramLinkValid = (link) => {
  const telegramLinkRegex = /^https:\/\/t\.me\/[a-zA-Z0-9_]+$/;
  return telegramLinkRegex.test(link);
};

function Homepage() {
  const [userDetails, setUserDetails] = useState(null);
  const [results, setResults] = useState('');
  const [link, setLink] = useState('');
  const router = useRouter();

  const obfuscator = obfuscatePortion({
    keepAtStart: Number.MAX_VALUE,
    atLeastFromEnd: 10,
  });

  // Function to save the Telegram link to the database and update user points
  const saveLinkToDatabase = async () => {
    try {
      if (!link || !isTelegramLinkValid(link)) {
        alert("Please enter a valid Telegram link in the correct format.");
        return;
      }

      if (!userDetails || !userDetails.username) {
        alert("User details are not available. Please sign in again.");
        return;
      }

      // Save the link and username to the telegramLinks collection
      await addDoc(collection(db, 'telegramLinks'), {
        link: link,
        username: userDetails.username,
      });

      // API request to the backend
      const response = await axios.post('http://localhost:8080/api/check', { link });
      setResults(response.data);

      // Increment the user's points by 1
      const userRef = doc(db, 'users', userDetails.id);
      await updateDoc(userRef, {
        points: userDetails.points + 1,
      });

      // Update the local state with the new points
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        points: prevDetails.points + 1,
      }));

      setLink(''); // Clear the input after submission
    } catch (error) {
      console.error("Error saving link to database:", error);
      alert("Failed to report the Telegram link.");
    }
  };

  // Function to get current user details from the database
  const getCurrentUserDetailsFromDatabase = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      if (!currentUser || !currentUser.email) {
        console.log("No user is currently logged in.");
        return null;
      }

      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', currentUser.email)
      );

      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() }; // Return the user data with ID
      } else {
        console.log("User document not found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  // Function to handle reporting and open the Telegram link
  const handleReport = async () => {
    try {
      // Open the specific Telegram group in the web browser
      const groupLink = results?.groupDetails?.link; // Using the original link, not the obfuscated one
      if (groupLink) {
        window.open(groupLink, '_blank'); // Open the original Telegram link

        // Show instructions for reporting
        setTimeout(() => {
          alert("Once the group opens, click on the three dots in the top-right corner of the Telegram interface and select 'Report' to proceed.");
        }, 1000);
      } else {
        alert("No group link available to report.");
      }
    } catch (error) {
      console.error("Error reporting the Telegram link:", error);
      alert("Failed to open the Telegram group.");
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const details = await getCurrentUserDetailsFromDatabase();
      setUserDetails(details);
    };

    fetchUserDetails();
  }, []);

  return (
    <>
      <div className='top-0 left-0 flex justify-between px-12 pt-4'>
        <div className='flex gap-4'>
          <Button variant='secondary' onClick={() => router.push('/leaderboard')}>Leaderboard 🏆</Button>
          <Button variant='secondary'>Groups</Button>
        </div>
        <div className='flex gap-4'>
          <p className="text-blue-500 hover:text-blue-600 cursor-pointer duration-500" onClick={() => router.push('/')}>Sign out</p>
          <p>{userDetails?.username}</p>
          {userDetails?.points > 0 ? <p className='text-yellow-400'><span>{userDetails?.points}</span> Points</p> : <p>0 Points</p>}
        </div>
      </div>
      <div className='min-h-screen w-full flex flex-col justify-center items-center'>
        <h1 className='text-[3rem] text-center'>Welcome to <span className='text-red-600'>Adult</span> Content Blocker</h1>

        <div className='max-w-xs w-full mt-16'>
          <div className='flex flex-col space-y-5'>
            <Input placeholder="Enter telegram link" value={link} onChange={(e) => setLink(e.target.value)} />
            <div className='max-w-xs w-full flex justify-center items-center'>
              <Button onClick={saveLinkToDatabase}>Check</Button>
            </div>

            {results ?
              <div className='flex w-full justify-between items-center px-5'>
                <div className='flex flex-col gap-4'>
                  <p>{obfuscator(results?.groupDetails?.name)}</p>
                  <p>{obfuscator(results?.groupDetails?.link)}</p>
                </div>
                <Button onClick={handleReport} className='bg-red-600'>Report</Button>
              </div> : <h1>No offensive content found</h1>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;

