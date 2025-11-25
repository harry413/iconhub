import React,{useState} from 'react'
import { AnimatePresence, motion }  from 'framer-motion'
import {useNavigate} from 'react-router-dom'
import { clickSound } from '../utils/Sounds';
import { Button } from '../components/ui/button';
import { FiArrowLeft } from 'react-icons/fi';
import SearchFilters from '../components/SearchFilters';

const jobPost = [
  {
    id: 1,
    title: "Frontend Developer",
    sbtitle: "React, JavaScript, CSS",
    description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building and maintaining our web applications."
  },
  { 
    id: 2,
    title: "Backend Developer",
    sbtitle: "Node.js, Express, MongoDB",
    description: "We are seeking a talented Backend Developer to help us develop robust server-side applications and APIs."
  },
  {
    id: 3,
    title: "UI/UX Designer",
    sbtitle: "Figma, Adobe XD, User Research",
    description: "Join our team as a UI/UX Designer to create intuitive and engaging user experiences for our digital products."
  }
];

const Career = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false) 
    const [selectedJob, setSelectedJob] = useState(null)
    // const [jobPost , setJobPost] = useState([]);
    // useEffect((e) => {
    //   e.preventDefault();
    //   // Fetch job postings from an API or data source
    //   fetchJobPostings().then((data) => {
    //     setJobPost(data);
    //   });
    // },[])


  return (
    <section className='px-4 '>
        <Button
                variant="ghost"
                className="mb-6"
                onClick={() => {
                  clickSound.play();
                  navigate("/");
                }}
              >
                <FiArrowLeft className="mr-2" /> Back to main page
              </Button>
        <h1 className='font-bold text-center text-3xl '>Career Page</h1>
        <div>
          <SearchFilters/>
        </div>
      <div className="flex items-center justify-center pt-10 ">
            {jobPost.length === 0 ? (
              <p className="text-gray-500 text-lg">No job postings available at the moment.</p>
            ) : (
              <div>
                {/* Render job postings here */}
                <div>Job Postings List</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 ">
                {jobPost.map((job,id) => ( 
                  <motion.div 
                        key={id}
                        whileHover={{scale:1.05}}
                        transition={{type: "spring" , stiffness:300}} 
                        className="mb-4 p-4 border rounded-lg shadow bg-green-700/10 transparent">
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <p>{job.sbtitle}</p>
                    
                    <Button variant="primary" className="mt-2" 
                      onClick={() =>{
                        setSelectedJob(job) 
                        setOpen(true)}}>
                        Apply Now</Button>
                  </motion.div>
                ))  
                }
                </div>
              </div>
            )}
      </div>
      {open && selectedJob && (
        <AnimatePresence>
          <div>
           <motion.div
             className="fixed inset-0 bg-black/50 backdrop-lur-sm z-40"
             onClick={() => setOpen(close)}
             initial={{ opacity: 0}}
             animate ={{ opacity: 1}}
             exit ={{ opacity: 0}}
           >
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ scale:0.7, opacity: 0}}
              animate ={{ scale: 1, opacity: 1}}
              exit ={{scale:0.7, opacity: 0}}
              >
                <div  className='bg-white dark:gray-800  text-gray-900 dark:text-gray-100 rounded-xl shadow-xl w-full max-w-md p-6 gap-4'>
                  <h2 className='text-2xl'>
                    Apply for the job {selectedJob.title}
                  </h2>
                  <p className='font-bold'>Skills: {selectedJob.sbtitle} </p>
                  <p>Job Description: {selectedJob.description} </p>
                  <p></p>
                  <div className='flex items-center justify-center gap-4 p-6'>
                    <button className="border border-red-500 text-red-500 hover:text-red-700 rounded-lg px-2 py-1" onClick={() => setOpen(close)}> Close</button>
                    <button className="border border-blue-500 text-blue-500 hover:text-blue-700 rounded-lg px-2 py-1">Proceed</button>
                  </div>
                </div>
              </motion.div>
           </motion.div>
          </div>
      </AnimatePresence>
      )}
    </section>
  )
}

export default Career;