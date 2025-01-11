// src/components/Layout/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
	return (
		<footer className="bg-gray-800 text-white py-4">
			<div className="container mx-auto text-center">
				&copy; {new Date().getFullYear()} Football Manager. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
