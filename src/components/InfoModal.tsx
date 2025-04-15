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
    if (buttonRef.current) {
      // Hide the button first
      buttonRef.current.style.opacity = '0';
      
      // Show the modal
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    if (buttonRef.current) {
      // Show the button
      buttonRef.current.style.opacity = '1';
      
      // Hide the modal
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        ref={buttonRef}
        className="info-button"
        onClick={handleOpen}
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
            <div className="modal-text-content">
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
        </div>
      )}
    </>
  );
}; 