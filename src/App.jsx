import React, { useState } from 'react';
import Popup from './Popup';
import jsPDF from 'jspdf';

const Dashboard = () => {
	const [columns, setColumns] = useState(['Project', 'Total']);
	const [data, setData] = useState([{ id: 1, values: ['Project 1', '0'] }]);
	const [isOpen, setIsOpen] = useState(false);
	const [value, setValue] = useState(0);
    const [index, setIndex] = useState(0);

	const handleColumnNameChange = (index, event) => {
		if (index === 0) return; // im assuming that project name should always be present
		const newColumns = [...columns];
		newColumns[index] = event.target.value;
		setColumns(newColumns);
	};

	const handleAddColumn = () => {
		setColumns([...columns, `Column ${columns.length}`]);
		setData(data.map((row) => ({ ...row, values: [...row.values, '0'] })));
	};

	const handleDeleteColumn = (index) => {
		setColumns(columns.filter((_, colIndex) => colIndex !== index));
		setData(
			data.map((row) => ({
				...row,
				values: row.values.filter((_, colIndex) => colIndex !== index),
			}))
		);
	};

	const handleAddRow = () => {
		const projectNumber = data.filter((row) => row.values).length + 1;
		setData([
			...data,
			{
				id: data.length + 1,
				values: [
					`Project ${projectNumber}`,
					...Array(columns.length - 1).fill('0'),
				],
			},
		]);
	};

	const handleDeleteRow = (id) => {
		setData(data.filter((row) => row.id !== id));
	};

	const handleValueChange = (rowIndex, colIndex, event) => {
		const newData = [...data];
		newData[rowIndex].values[colIndex] = event.target.value;
		setData(newData);
	};

	const calculateColumnSum = (colIndex) => {
		return data.reduce(
			(sum, row) => sum + (Number(row.values[colIndex]) || 0),
			0
		);
	};

	const handlePrintRow = (row) => {
		const rowTotal = Number(row.values[1]) || 0;
		const doc = new jsPDF();
		let y = 10;

		columns.forEach((col, index) => {
			let percent =
				((Number(row.values[index]) || 0) / Number(row.values[1])) * 100;
			if (index == 0 || index == 1) {
                doc.text(`${col}: ${row.values[index]}`, 10, y);
			} else {
				doc.text(`${col}: ${row.values[index]} (${percent}%)`, 10, y);
			}
			y += 10;
		});

		doc.save(`${row.values[0]}.pdf`);
	};

	return (
		<div className='overflow-x-auto bg-sky-200 h-screen'>
			<Popup isOpen={isOpen} setIsOpen={setIsOpen} data={data} columns={columns} value={value} index={index} />
			<div className='mt-20 justify-center flex gap-5'>
				<button
					type='button'
					className='p-2 transition text-xl hover:ring-8 text-white bg-blue-800'
					onClick={handleAddRow}
				>
					Add Row
				</button>
				<button
					type='button'
					className='p-2 transition text-xl hover:ring-8 text-white bg-blue-800'
					onClick={handleAddColumn}
				>
					Add Column
				</button>
			</div>
			<table className='mx-auto divide-y-2 divide-gray-200 bg-white text-sm mt-7 shadow-xl shadow-gray-500 min-w-[95%]'>
				<thead>
					<tr>
						{columns.map((col, index) => (
							<th
								className='whitespace-nowrap px-4 py-2 font-medium text-gray-900 border-l-2 border-gray-500'
								key={index}
							>
								<input
									type='text'
									className='bg-inherit'
									value={col}
									onChange={(e) => handleColumnNameChange(index, e)}
								/>
								{index > 0 && (
									<>
										<button
											className='bg-blue-800 text-white py-1 px-3 transition hover:bg-blue-900'
											onClick={() => {
												setValue(calculateColumnSum(index));
                                                setIndex(index)
												setIsOpen(true);
											}}
										>
											Details
										</button>
										<button
											className='bg-red-800 text-white py-1 px-3 ml-4 transition hover:bg-red-900'
											onClick={() => handleDeleteColumn(index)}
										>
											Delete
										</button>
									</>
								)}
							</th>
						))}
						<th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900 border-l-2 border-gray-500'>
							Actions
						</th>
					</tr>
				</thead>
				<tbody className='divide-y divide-gray-200'>
					{data.map((row, rowIndex) => {
						const rowTotal = Number(row.values[1]) || 0;
						return (
							<tr className='odd:bg-gray-50 text-center' key={row.id}>
								{row.values.map((value, colIndex) => (
									<td
										className='whitespace-nowrap font-medium text-gray-900 border-l-2 border-gray-500'
										key={colIndex}
									>
										<input
											type='text'
											className='bg-inherit'
											value={value}
											onChange={(e) => handleValueChange(rowIndex, colIndex, e)}
										/>
										{colIndex > 1 && rowTotal !== 0 && (
											<span className='ml-2 text-gray-600'>
												({((Number(value) || 0) / rowTotal) * 100}%)
											</span>
										)}
									</td>
								))}
								<td className='border-l-2 flex justify-center border-gray-500 py-2'>
									<button
										className='bg-blue-800 text-white py-1 px-3 transition hover:bg-blue-900'
										onClick={() => handlePrintRow(row)}
									>
										Print
									</button>
									<button
										className='bg-red-800 text-white py-1 px-3 ml-4 transition hover:bg-red-900'
										onClick={() => handleDeleteRow(row.id)}
									>
										Delete
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default Dashboard;
