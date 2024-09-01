'use client';

import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { db } from "@/firebase/config";
import { getDocs, collection, addDoc, updateDoc, doc, query, where } from "firebase/firestore";
import axios from 'axios';


const isTelegramLinkValid = (link) => {
  const telegramLinkRegex = /^https:\/\/t\.me\/[a-zA-Z0-9_]+$/;
  return telegramLinkRegex.test(link);
};



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

function Homepage() {
  const [userDetails, setUserDetails] = useState(null);
  const [results, setResults] = useState('');
  const [link, setLink] = useState('');
  const [allLinks, setAllLinks] = useState([]);
  const router = useRouter();


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

      await addDoc(collection(db, 'telegramLinks'), {
        link: link,
        username: userDetails.username,
      });


      const response = await axios.post('https://telegram-nsfw-banner.vercel.app/api/check', { link });
      setResults(response.data);

      console.log(results);

      const userRef = doc(db, 'users', userDetails.id);
      await updateDoc(userRef, {
        points: userDetails.points + 1,
      });

      setUserDetails((prevDetails) => ({
        ...prevDetails,
        points: prevDetails.points + 1,
      }));

      alert("Telegram link reported successfully!");
      setLink('');
      const groupLink = results?.groupDetails?.link;
      if (groupLink) {
        const telegramWebUrl = groupLink;
        window.open(telegramWebUrl, '_blank');
        setTimeout(() => {
          alert("Once the group opens, click on the three dots in the top-right corner of the Telegram interface and select 'Report' to proceed.");
        }, 1000);
      }
    } catch (error) {
      console.error("Error saving link to database:", error);
      alert("Failed to report the Telegram link.");
    }
  };


  const getAllLinks = async () => {
    const querySnapshot = await getDocs(collection(db, "telegramLinks"));

    // Use a Map to track unique links
    const linkMap = new Map();

    querySnapshot.docs.forEach((doc) => {
      const link = doc.data().link;

      // Only add the link if it hasn't been added before
      if (!linkMap.has(link)) {
        linkMap.set(link, { id: doc.id, ...doc.data() });
      }
    });

    // Convert the Map values to an array and set the state
    const uniqueLinks = Array.from(linkMap.values());

    setAllLinks(uniqueLinks);
  };

  useEffect(() => {
    getAllLinks();

    const fetchUserDetails = async () => {
      const details = await getCurrentUserDetailsFromDatabase();
      setUserDetails(details);
    };

    fetchUserDetails();
    // getCurrentUserDetailsFromDatabase()
    getAllLinks()
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
      <div className='min-h-screen mt-20 w-full flex flex-col justify-center items-center'>
        <h1 className='text-[3rem] text-center'>Welcome to <span className='text-red-600'>Adult</span> Content Blocker</h1>

        <div className='max-w-xs w-full mt-16'>
          <div className='flex flex-col space-y-5'>
            <Input placeholder="Enter telegram link" value={link} onChange={(e) => setLink(e.target.value)} />
            <div className='max-w-xs w-full flex justify-center items-center'>
              <Button onClick={saveLinkToDatabase}>Check</Button>
            </div>

            {results &&
              <div>
                <h1>{results.groupDetails?.name}</h1>
                <h1>{results.groupDetails?.link}</h1>

                <Button onClick={saveLinkToDatabase}>Check</Button>
              </div>}

            {/* Displaying all the fetched links */}
<<<<<<< HEAD
            <div className=''>
              <h2 className="text-4xl mt-14 text-center font-bold">All Reported <span className='text-red-700 font-bold'>Links</span></h2>
                <ul>
                {allLinks.map((item, index) => (
                  <li key={index} className='flex gap-6 py-3 float-start justify-between w-full items-center'>
                    <p className='text-gray-200 text-[15px]'>{item?.link}</p>
                    <Button className='text-[13px] py-0 px-3 bg-red-400 hover:bg-red-500 ' onClick={ () => {
                          if (!item?.link) {
                              console.error('No link provided');
                              return;
                          }
                  
                          // Open the provided Telegram link in a new tab
                          window.open(item?.link, '_blank');
                  
                          // Redirect to the upload page after a delay (e.g., 20 seconds)
                          setTimeout(() => {
                              router.push('/upload');
                          }, 4000)
=======
            <div>
              <h2 className="text-lg font-bold">All Reported Links</h2>
              <ul>
                {allLinks.map((item, index) => (
                  <li key={index}>
                    <p>{item?.link}</p>
                    <Button onClick={() => {
                      if (!item?.link) {
                        console.error('No link provided');
                        return;
                      }

                      // Open the provided Telegram link in a new tab
                      window.open(item?.link, '_blank');

                      // Redirect to the upload page after a delay (e.g., 20 seconds)
                      setTimeout(() => {
                        router.push('/upload');
                      }, 4000)
>>>>>>> 86f6172d4d8f73035dddba90f13dc2d16e7a0f72
                    }

                    }>Report</Button>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;