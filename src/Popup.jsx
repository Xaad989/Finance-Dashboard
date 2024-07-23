import { AnimatePresence, motion } from 'framer-motion';
import jsPDF from 'jspdf';

const Popup = ({ isOpen, setIsOpen, data, columns, value, index }) => {
	const handlePrintCol = (index, data) => {
		const doc = new jsPDF();
		let y = 10;

		data.forEach((row) => {
			const projectName = row.values[0]; // Assuming the project name is in the first column
			doc.text(`${projectName}: ${row.values[index]}`, 10, y);
			y += 10;
		});

		doc.save(`${columns[index]}.pdf`);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setIsOpen(false)}
					className='bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer'
				>
					<motion.div
						initial={{ scale: 0, rotate: '0deg' }}
						animate={{ scale: 1, rotate: '0deg' }}
						exit={{ scale: 0, rotate: '0deg' }}
						onClick={(e) => e.stopPropagation()}
						className='bg-gradient-to-br from-blue-800 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden'
					>
						{/* <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" /> */}
						<div className='relative z-10'>
							{/* <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                <FiAlertCircle />
              </div> */}
							<p className='text-center'>
								Total Expenses: {value}
								<br />
								<br />
								<button
									className='bg-blue-600 text-white py-1 px-3 transition hover:bg-blue-900'
									onClick={() => handlePrintCol(index, data)}
								>
									Print
								</button>
							</p>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Popup;
