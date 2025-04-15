import { useState, useEffect, useRef } from 'react';
import './InfoModal.css';

export const InfoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Check if user has seen the modal before
    const seenModal = localStorage.getItem('hasSeenInfoModal');
    if (!seenModal) {
      setIsOpen(true);
      localStorage.setItem('hasSeenInfoModal', 'true');
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    // Wait for the next frame to ensure the modal is rendered
    requestAnimationFrame(() => {
      if (modalRef.current && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        
        // Set initial position at the button's location
        modalRef.current.style.position = 'fixed';
        modalRef.current.style.top = `${buttonRect.top}px`;
        modalRef.current.style.left = `${buttonRect.left}px`;
        modalRef.current.style.width = `${buttonRect.width}px`;
        modalRef.current.style.height = `${buttonRect.height}px`;
        modalRef.current.style.margin = '0';
        modalRef.current.style.transform = 'none';
        
        // Trigger the expanding animation
        requestAnimationFrame(() => {
          modalRef.current!.classList.add('expanding');
        });
      }
    });
  };

  const handleClose = () => {
    if (modalRef.current && buttonRef.current) {
      const modalRect = modalRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      
      // Calculate the scale to match the button's size
      const scale = buttonRect.width / modalRect.width;
      
      // Calculate the center points
      const modalCenterX = modalRect.left + modalRect.width / 2;
      const modalCenterY = modalRect.top + modalRect.height / 2;
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;
      
      // Calculate the translation needed to move the modal's center to the button's center
      const translateX = buttonCenterX - modalCenterX;
      const translateY = buttonCenterY - modalCenterY;

      // Apply the animation
      modalRef.current.style.transformOrigin = 'center';
      modalRef.current.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      modalRef.current.style.borderRadius = '50%';
      modalRef.current.style.backgroundColor = '#4a4a4a';
      modalRef.current.style.opacity = '1';
      
      // Close the modal after animation
      setTimeout(() => {
        setIsOpen(false);
        modalRef.current!.style.transform = '';
        modalRef.current!.style.opacity = '';
        modalRef.current!.style.borderRadius = '';
        modalRef.current!.style.backgroundColor = '';
        modalRef.current!.style.transformOrigin = '';
      }, 300);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        ref={buttonRef}
        className={`info-button ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Show information"
      >
        ?
      </button>
      
      {isOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <div 
            ref={modalRef}
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button className="close-button" onClick={handleClose}>×</button>
            <h2>D&D 5E Alternative Encounter Builder</h2>
            <p>
              This tool helps you calculate combat encounter difficulty more accurately using Power Equivalent Values (PELs) instead of the traditional Challenge Rating (CR) system.
            </p>
            <h3>How to use:</h3>
            <ol>
              <li>Set your party size and level in the Party section</li>
              <li>Search for creatures in the Creature Selector</li>
              <li>Add creatures to your encounter using the + button</li>
              <li>View the difficulty rating in the center</li>
              <li>Add custom creatures if needed</li>
            </ol>
            <p>
              The difficulty ratings range from "trivial" to "absurd" to help you balance your encounters.
            </p>
          </div>
        </div>
      )}
    </>
  );
}; 