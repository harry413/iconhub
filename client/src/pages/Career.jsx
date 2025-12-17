import React,{useState} from 'react'
import { AnimatePresence, motion }  from 'framer-motion'
import { useNavigate} from 'react-router-dom'
import { clickSound } from '../utils/Sounds';
import { Button } from '../components/ui/button';
import { FiArrowLeft } from 'react-icons/fi';
import SearchFilters from '../components/SearchFilters';

const jobPost = [
  {
    id: 1,
    time: "Contract based",
    title: "Frontend Developer",
    type: "Remote",
    sbtitle: "React, JavaScript, CSS",
    description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building and maintaining our web applications."
  },
  { 
    id: 2,
    time: "full-time",
    title: "Backend Developer",
    type: "Hybrid",
    sbtitle: "Node.js, Express, MongoDB",
    description: "We are seeking a talented Backend Developer to help us develop robust server-side applications and APIs."
  },
  {
    id: 3,
    time:"full-time",
    title: "UI/UX Designer",
    type: "Remote",
    sbtitle: "Figma, Adobe XD, User Research",
    description: "Join our team as a UI/UX Designer to create intuitive and engaging user experiences for our digital products."
  },
  {
    id: 4,
    time: "part-time",
    title: "full-stack Developer",
    type: "Hybrid",
    sbtitle: "MERN Stack, RESTful APIs, Agile",
    description: "we are looking for a Marketing Specialist to develop and implement marketing strategies that drive brand awareness and customer engagement."
  },
  {
    id: 5,
    time: "Contract based",
    title: "DevOps Engineer",
    type: "On-site",
    sbtitle: "AWS, Docker, CI/CD",
    description: "We are looking for a DevOps Engineer to streamline our development and deployment processes using modern tools and practices."
  },
  {
    id: 6,
    time: "full-time",
    title: "Data Scientist",
    type: "Remote",
    sbtitle: "Python, Machine Learning, Data Analysis",
    description: "We are seeking a Data Scientist to analyze complex datasets and develop predictive models to drive business insights."
  },
  {
    id: 7,
    time: "Contract based",
    title: "Frontend Developer",
    type: "Remote",
    sbtitle: "React, JavaScript, CSS",
    description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building and maintaining our web applications."
  },
  { 
    id: 8,
    time: "full-time",
    title: "Backend Developer",
    type: "Hybrid",
    sbtitle: "Node.js, Express, MongoDB",
    description: "We are seeking a talented Backend Developer to help us develop robust server-side applications and APIs."
  },
  {
    id: 9,
    time:"full-time",
    title: "UI/UX Designer",
    type: "Remote",
    sbtitle: "Figma, Adobe XD, User Research",
    description: "Join our team as a UI/UX Designer to create intuitive and engaging user experiences for our digital products."
  },
  {
    id: 10,
    time: "part-time",
    title: "full-stack Developer",
    type: "Hybrid",
    sbtitle: "MERN Stack, RESTful APIs, Agile",
    description: "we are looking for a Marketing Specialist to develop and implement marketing strategies that drive brand awareness and customer engagement."
  },
  {
    id: 11,
    time: "Contract based",
    title: "DevOps Engineer",
    type: "On-site",
    sbtitle: "AWS, Docker, CI/CD",
    description: "We are looking for a DevOps Engineer to streamline our development and deployment processes using modern tools and practices."
  },
  {
    id: 12,
    time: "full-time",
    title: "Data Scientist",
    type: "Remote",
    sbtitle: "Python, Machine Learning, Data Analysis",
    description: "We are seeking a Data Scientist to analyze complex datasets and develop predictive models to drive business insights."
  }
  
];

const Career = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false) 
    const [selectedJob, setSelectedJob] = useState(null)
    const [searchTerm, setSearchTerm] = useState('');

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
        <div className="flex items-center justify-center pt-10 ">
                <input
                   type="text"
                   placeholder="Search for the role.."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className=" py-2 px-4 border border-gray-400 rounded-full focus:outline-none"
                 />
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
             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center pt-20"
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
                <div  className='bg-white dark:gray-800  text-gray-900 dark:text-gray-100 rounded-xl shadow-xl w-full max-w-md p-6 gap-10'>
                
                   <h2 className='text-2xl font-bold mb-4'>
                    Apply for the job {selectedJob.title}
                  </h2>
                  <p className='font-semibold'>{selectedJob.type} </p>
                  <p className='font-semibold'>{selectedJob.time} </p>
                  <p className='font-bold'>{selectedJob.sbtitle} </p>
                  <p>Job Description: {selectedJob.description} </p>
                    <div className='flex items-center justify-center gap-4 p-2 mt-6'>
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