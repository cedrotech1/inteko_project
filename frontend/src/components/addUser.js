import React, { useState, useEffect } from "react";

const AddUser = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    role: "",
    gender: "Male",
    address: "",
    province_id: "",
    district_id: "",
    sector_id: "",
    cell_id: "",
    village_id: "",
  });

  const [message, setMessage] = useState("");
  const [addressData, setAddressData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);
  const [villages, setVillages] = useState([]);
  let token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/address`);
        const data = await response.json();
        if (data.success) {
          setAddressData(data.data); // Store all address data
        } else {
          setMessage("Failed to fetch address data.");
        }
      } catch (error) {
        setMessage("Error fetching address data: " + error.message);
      }
    };
    fetchAddressData();
  }, []);

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setFormData({ ...formData, province_id: provinceId, district_id: "", sector_id: "", cell_id: "", village_id: "" });

    const selectedProvince = addressData.find(province => province.id === parseInt(provinceId));
    setDistricts(selectedProvince ? selectedProvince.districts : []);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setFormData({ ...formData, district_id: districtId, sector_id: "", cell_id: "", village_id: "" });

    const selectedDistrict = districts.find(district => district.id === parseInt(districtId));
    setSectors(selectedDistrict ? selectedDistrict.sectors : []);
  };

  const handleSectorChange = (e) => {
    const sectorId = e.target.value;
    setFormData({ ...formData, sector_id: sectorId, cell_id: "", village_id: "" });

    const selectedSector = sectors.find(sector => sector.id === parseInt(sectorId));
    setCells(selectedSector ? selectedSector.cells : []);
  };

  const handleCellChange = (e) => {
    const cellId = e.target.value;
    setFormData({ ...formData, cell_id: cellId, village_id: "" });

    const selectedCell = cells.find(cell => cell.id === parseInt(cellId));
    setVillages(selectedCell ? selectedCell.villages : []);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/addUser`, {
        method: "POST",
        headers: {
          "accept": "*/*",
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("User added successfully!");
      } else {
        setMessage(data.message || "Failed to add user.");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="container memberx mt-5">
      <h2 className="text-center mb-4">Add User</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <input type="text" name="firstname" className="form-control" placeholder="First Name" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="text" name="lastname" className="form-control" placeholder="Last Name" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="text" name="phone" className="form-control" placeholder="Phone" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <select
            name="role"
            className="form-select"
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="province_leader">Province Leader</option>
            <option value="district_leader">District Leader</option>
            <option value="sector_leader">Sector Leader</option>
            <option value="cell_leader">Cell Leader</option>
            <option value="village_leader">Village Leader</option>
            <option value="admin">Admin</option>
          </select>
        </div>


        <div className="col-md-6">
        <label>
          Select Gender:
          <select required className="form-control" onChange={handleChange}>
            <option value="" disabled>-- Select --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        </div>

        {/* Address dropdowns */}
        <div className="col-md-6">
          <select name="province_id" className="form-select" onChange={handleProvinceChange} required>
            <option value="">Select Province</option>
            {addressData.map((province) => (
              <option key={province.id} value={province.id}>{province.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <select name="district_id" className="form-select" onChange={handleDistrictChange} disabled={!formData.province_id} required>
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>{district.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <select name="sector_id" className="form-select" onChange={handleSectorChange} disabled={!formData.district_id} required>
            <option value="">Select Sector</option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id}>{sector.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <select name="cell_id" className="form-select" onChange={handleCellChange} disabled={!formData.sector_id} required>
            <option value="">Select Cell</option>
            {cells.map((cell) => (
              <option key={cell.id} value={cell.id}>{cell.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <select name="village_id" className="form-select" onChange={handleChange} disabled={!formData.cell_id} required>
            <option value="">Select Village</option>
            {villages.map((village) => (
              <option key={village.id} value={village.id}>{village.name}</option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">Add User</button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
