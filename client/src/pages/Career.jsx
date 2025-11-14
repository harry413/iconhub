import React from 'react'
import {useNavigate} from 'react-router-dom'
import { clickSound } from '../utils/Sounds';
import { Button } from '../components/ui/button';
import { FiArrowLeft } from 'react-icons/fi';
import SearchFilters from '../components/SearchFilters';

const Career = () => {
    const navigate = useNavigate();
  return (
    <section className='px-4'>
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
    </section>
  )
}

export default Career