import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle, faCheckCircle, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

import './Homepage.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Homepage() {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [fileData, setFileData] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); 
    const rowsPerPage = 10; 

    const handleStartTimeChange = (newValue) => {
        setStartTime(newValue);
    };

    const handleEndTimeChange = (newValue) => {
        setEndTime(newValue);
    };

    const filterData = () => {
        if (!startTime || !endTime) {
            setNoResults(true);
            return [];
        }

        const startSeconds = startTime.$H * 3600 + startTime.$m * 60;
        const endSeconds = endTime.$H * 3600 + endTime.$m * 60 + 59;

        console.log('Start seconds:', startSeconds);
        console.log('End seconds:', endSeconds);
        console.log('Dữ liệu cột Giờ:', fileData.map(item => item['Giờ']));

        const results = [];
        console.log('Cấu trúc fileData:', JSON.stringify(fileData));

        for (let i = 0; i < fileData.length; i++) {
            const item = fileData[i];
            if (!item['Giờ'] || typeof item['Giờ'] !== 'string') continue;

            const [hours, minutes, seconds] = item['Giờ'].split(':').map(Number);
            const transactionSeconds = hours * 3600 + minutes * 60 + seconds;

            console.log(`Transaction seconds for ${item['Giờ']}:`, transactionSeconds);

            if (transactionSeconds >= startSeconds && transactionSeconds <= endSeconds) {
                results.push(item);
            }
        }

        console.log('Filtered results:', results);

        setNoResults(results.length === 0);
        return results;
    };

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setFileUploaded(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 7 });
                
                console.log('Dữ liệu thô từ file:', jsonData);

                if (jsonData.length > 0) {
                    const headers = jsonData[0];
                    const rows = jsonData.slice(1).map(row => {
                        const formattedRow = {};
                        headers.forEach((header, index) => {
                            formattedRow[header] = row[index];
                        });
                        return formattedRow;
                    });
                    
                    console.log('Các hàng đã được đọc:', rows);
                    setFileData(rows);
                } else {
                    console.log('No data found in the file.');
                }
            };
            reader.readAsArrayBuffer(file);
            setIsModalOpen(false);
        } else {
            console.log('No file was uploaded.');
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.xlsx' });

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="home-page">
            <nav className="header">
                <div className="header-content">
                    <a className="app_name" href="/">TM App</a>
                    <ul className="header-action">
                        <li className="nav-item action_active">
                            <a className="nav-link nav-link-active active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/update-transaction">Update transaction</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/api-data">Task 4</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="home-page_content">
                <p className="greeting">Welcome to TM App!</p>
                <div className="content-top">
                    <div className="content-upload_file">
                        <button className="file-label" onClick={() => setIsModalOpen(true)}>
                            Select file
                        </button>
                        {fileUploaded ? (
                            <FontAwesomeIcon className="check-icon" icon={faCheckCircle} />
                        ) : (
                            <FontAwesomeIcon className="x-mark-icon" icon={faXmarkCircle} />
                        )}
                    </div>
                    <div className="content-query">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <TimePicker
                                    label="Start Time"
                                    value={startTime}
                                    onChange={handleStartTimeChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <TimePicker
                                    label="End Time"
                                    value={endTime}
                                    onChange={handleEndTimeChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </div>
                        </LocalizationProvider>
                        <button className="search-btn" onClick={() => {
                            if (!startTime || !endTime) {
                                alert('Please select both start and end times.');
                                return;
                            }

                            const results = filterData();
                            setFilteredData(results);
                            setCurrentPage(1);
                        }}>Search</button>
                    </div>
                </div>
                <div className="content-table">
                    <div className="table-wrapper">
                        <table border="1" className="table table-borderless">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th className='table-date'>Date</th>
                                    <th className='table-time'>Hour</th>
                                    <th>Station</th>
                                    <th>Pump Head</th>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total (VND)</th>
                                    <th>Payment Status</th>
                                    <th>Invoice Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {noResults && <tr><td colSpan="11">No results found for the selected time range.</td></tr>}
                                {currentRows.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row['STT']}</td>
                                        <td className='table-date'>{row['Ngày']}</td>
                                        <td className='table-time'>{row['Giờ']}</td>
                                        <td>{row['Trạm']}</td>
                                        <td>{row['Trụ bơm']}</td>
                                        <td>{row['Mặt hàng']}</td>
                                        <td>{row['Số lượng']}</td>
                                        <td>{row['Đơn giá']}</td>
                                        <td>{row['Tổng (VND)']}</td>
                                        <td>{row['Trạng thái thanh toán']}</td>
                                        <td>{row['Trạng thái hoá đơn']}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button className="prev-btn" onClick={handlePrevPage} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span className="curent-page">Page {currentPage} of {totalPages}</span>
                        <button className="next-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </div>

                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <div style={style} className="modal-upload-file">
                        <h2 id="modal-title">Upload File</h2>
                        <div {...getRootProps()} className="dropzone">
                            <input {...getInputProps()} />
                            <FontAwesomeIcon className="upload-icon" icon={faCloudArrowUp} />
                            {isDragActive ? (
                                <p>Drop the files here ...</p>
                            ) : (
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            )}
                        </div>
                        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(false)}>Close</Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default Homepage;
