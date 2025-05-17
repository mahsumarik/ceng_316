import React, { useState } from 'react';

const Pagination = ({ filteredItems, itemsPerPage, children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div>
      {children(currentItems)}
      {filteredItems.length > itemsPerPage && (
        <div className="pagination-controls">
          <button onClick={handlePrev} disabled={currentPage === 1}>←</button>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>→</button>
        </div>
      )}
    </div>
  );
};

export default Pagination; 