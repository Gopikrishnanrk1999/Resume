import React from 'react'
import { motion, useScroll } from 'framer-motion'
import { skills, summaryText } from '../assets/profileInfo'

const Profile = () => {
    const { scrollYProgress } = useScroll();

    const styless = {
        hidden: { opacity: 0 }
        , show: { opacity: 1, transition: { staggerChildren: 0.25, } }
    }

    return (
        <>
            <div style={{ margin: '50px 0px' }}>
                <motion.h1
                    className='my-name'
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                >GOPIKRISHNAN</motion.h1>
                <motion.div
                    className='desg-text'
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                >FRONT END DEVELOPER</motion.div>
            </div>
            <motion.div
                variants={styless}
                className="box"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            >
                <div className='profile-img'><img src='' /></div>
            </motion.div>
            <div className='about-section'>
                <h1 className='section-heading'>ABOUT</h1>
                <hr className='section-division' />
                <article className='summary'><p>{summaryText}</p></article>
            </div>
            <div className='skill-section'>
                <h1 className='section-heading'>SKILLS</h1>
                <hr className='section-division' />
                <div className='technology-list'

                >{skills.map(each => <motion.span className='tech-pills'
                    style={{ scaleX: scrollYProgress }}
                    initial={{ opacity: 1, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0 }}
                    key={each.techName}>{each.techName}</motion.span>)}</div>
            </div >
            <div className='project-section'>
                <h1 className='section-heading'>WORKS</h1>
                <hr className='section-division' />
                <article className='summary'><p>{summaryText}</p></article>
            </div>
        </>
    )
}

export default Profile