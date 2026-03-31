// "use client";

// export default function ColorList({ colors, setColors, theme }) {
//   const addColor = () => {
//     setColors([...colors, { name: "new-color", value: "#000000" }]);
//   };

//   const removeColor = (index) => {
//     const updated = colors.filter((_, i) => i !== index);
//     setColors(updated);
//   };

//   const updateColor = (index, key, value) => {
//     const updated = [...colors];
//     updated[index][key] = value;
//     setColors(updated);
//   };

//   return (
//     <div className="mb-6 space-y-4">
//       {colors.map((c, i) => (
//         <div
//           key={i}
//           className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
//         >
//           {/* Name */}
//           <input
//             type="text"
//             value={c.name}
//             onChange={(e) =>
//               updateColor(i, "name", e.target.value.replace(/\s+/g, "-"))
//             }
//             className="border px-3 py-2 rounded w-full sm:w-40"
//             placeholder="primary"
//           />

//           {/* Color */}
//           <input
//             type="color"
//             value={c.value}
//             onChange={(e) => updateColor(i, "value", e.target.value)}
//           />

//           {/* HEX */}
//           <input
//             type="text"
//             value={c.value}
//             onChange={(e) => updateColor(i, "value", e.target.value)}
//             className="border px-3 py-2 rounded w-full sm:w-40"
//           />

//           {/* Remove */}
//           <button
//             onClick={() => removeColor(i)}
//             className="px-3 py-2 border rounded text-red-400"
//           >
//             ✕
//           </button>
//         </div>
//       ))}

//       {/* Add Button */}
//       <button
//         onClick={addColor}
//         className="px-4 py-2 border rounded text-green-400"
//       >
//         + Add Color
//       </button>
//     </div>
//   );
// }
