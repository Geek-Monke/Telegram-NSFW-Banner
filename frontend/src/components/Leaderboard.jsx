import React from 'react'

function Leaderboard() {
  
  const users = [
    { rank: 1, username: 'user3421', points: Math.floor(Math.random() * 1000) },
    { rank: 2, username: 'user8276', points: Math.floor(Math.random() * 1000) },
    { rank: 3, username: 'user5392', points: Math.floor(Math.random() * 1000) },
    { rank: 4, username: 'user1498', points: Math.floor(Math.random() * 1000) },
    { rank: 5, username: 'user7325', points: Math.floor(Math.random() * 1000) },
    { rank: 6, username: 'user2837', points: Math.floor(Math.random() * 1000) },
    { rank: 7, username: 'user9374', points: Math.floor(Math.random() * 1000) },
    { rank: 8, username: 'user1942', points: Math.floor(Math.random() * 1000) }
  ];
  
  
  return (
    <>
    <div className='min-h-screen w-full justify-center items-center flex flex-col'>
    <h1 className='text-[3rem] top-3 left-3 text-center'>Top <span className='text-yellow-400'>users</span> who helped us reduce <span className='text-red-600'> adult</span> content</h1>
        <div className='w-[50%] py-10 rounded-xl text-white flex flex-col justify-center items-center'>
          <div className='w-full flex justify-between items-center'>
            <div className='text-[25px]'>Rank 🏆
              <ul>
                {
                  users.map((user, index) => (
                    <li className='text-center text-[16px]'>{user.rank}</li>
                  ))
                }
              </ul>
            </div>
            <div className='text-[25px]'>User 🙋‍♂️
              <ul>
              {
                  users.map((user, index) => (
                    <li className='text-center text-[16px]'>{user.username}</li>
                  ))
                }
              </ul>
            </div>
            <div className='text-[25px]'>Points 📈
              <ul>
              {
                  users.map((user, index) => (
                    <li className='text-center text-[16px]'>{user.points}</li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
    </div>
    </>
  )
}

export default Leaderboard