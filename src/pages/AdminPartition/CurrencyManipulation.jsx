import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, AlertCircle, Upload, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { api } from '@utils/axiosInstance.js';
import MainLoading from "@components/Loaders/MainLoading.jsx";
import Swal from 'sweetalert2';
import { iconOptions } from '../../utils/iconOptions.js';

const initialFormState = {
    currency_code: '',
    currency_name: '',
    buy_rate: '0',
    sell_rate: '0',
    icon: null
};

const alertConfigs = {
    success: {
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#fff'
    },
    error: {
        confirmButtonText: 'OK',
        confirmButtonColor: '#DC5233',
        background: '#1f2937',
        color: '#fff'
    },
    confirm: {
        showCancelButton: true,
        confirmButtonColor: '#DC5233',
        cancelButtonColor: '#374151',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        background: '#1f2937',
        color: '#fff'
    }
};

const FormInput = React.memo(({ label, type, placeholder, value, onChange, disabled, required, ...props }) => {
    const { textClass } = useTheme();

    return (
        <div className="space-y-2">
            <label className={`text-sm font-medium ${textClass}`}>
                {label} {required && '*'}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                {...props}
            />
        </div>
    );
});

const FileInput = React.memo(({
                                 label,
                                 onChange,
                                 previewIcon,
                                 onClear,
                                 loading,
                                 required,
                                 inputRef, // Add inputRef prop
                                 ...props
                             }) => {
    const { textClass } = useTheme();

    return (
        <div>
            <label className={`text-sm font-medium ${textClass}`}>
                {label} {required && '*'}
            </label>
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <input
                        type="file"
                        ref={inputRef} // Use passed ref instead
                        onChange={onChange}
                        className="hidden"
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => inputRef?.current?.click()}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
                        disabled={loading}
                    >
                        <Upload size={20}/>
                        {previewIcon ? 'Change Icon' : 'Upload Icon'}
                    </button>
                </div>

                {previewIcon && (
                    <div className="relative">
                        <img
                            src={previewIcon}
                            alt="Icon preview"
                            className="h-10 w-10 object-contain"
                        />
                        <button
                            type="button"
                            onClick={onClear}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                            disabled={loading}
                        >
                            <X size={12} className="text-white"/>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

const CurrencyManipulation = () => {
  const {
    cardClass,
    textClass,
    tableHeaderClass,
    tableRowClass,
    tableDataClass,
  } = useTheme();
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const [previewIcon, setPreviewIcon] = useState(null);
  const fileInputRef = useRef(null);
  const initialRender = useRef(true);
  const [selectedPresetIcon, setSelectedPresetIcon] = useState("");

  // Alert helpers with consistent configuration
  const showAlert = useCallback((type, title, text) => {
    return Swal.fire({
      title,
      text,
      icon: type,
      ...alertConfigs[type],
    });
  }, []);

  // Alert helpers
  const showSuccessAlert = useCallback(
    (message) => showAlert("success", "Success!", message),
    [showAlert]
  );
  const showErrorAlert = useCallback(
    (message) => showAlert("error", "Error!", message),
    [showAlert]
  );
  const showConfirmationAlert = useCallback(
    (title, text) => showAlert("confirm", title, text),
    [showAlert]
  );


  const handlePresetIconSelect = useCallback(
    async (fileName) => {
      setSelectedPresetIcon(fileName);

      if (!fileName) {
        // kalau user pilih "None"
        setFormData((prev) => ({ ...prev, icon: null }));
        setPreviewIcon(null);
        return;
      }

      try {
        const res = await fetch(`/flag/${fileName}`);
        if (!res.ok) {
          throw new Error("Failed to load icon file");
        }

        const blob = await res.blob();
        const file = new File([blob], fileName, {
          type: blob.type || "image/svg+xml",
        });

        setFormData((prev) => ({ ...prev, icon: file }));
        setPreviewIcon(`/flag/${fileName}`);
      } catch (error) {
        console.error("Error loading preset icon:", error);
        showErrorAlert("Failed to load preset icon");
      }
    },
    [setFormData, showErrorAlert]
  );

  const handleApiCall = useCallback(
    async (method, endpoint, data = null, config = {}) => {
      try {
        const response = await api[method](endpoint, data, config);
        if (response.status === "success") {
          return response;
        }
        throw new Error(response.message || "Operation failed");
      } catch (err) {
        console.error(`API ${method} error:`, err);
        throw err;
      }
    },
    []
  );

  const fetchCurrencies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await handleApiCall("get", "/currencies");
      setCurrencies(response.data);
    } catch (err) {
      showErrorAlert("Failed to fetch currencies");
      setCurrencies([]);
    } finally {
      setLoading(false);
    }
  }, [handleApiCall]);

  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) return currencies;

    const searchLower = searchTerm.toLowerCase();
    return currencies.filter((currency) => {
      return (
        currency.currency_code.toLowerCase().includes(searchLower) ||
        currency.currency_name.toLowerCase().includes(searchLower) ||
        currency.buy_rate.toString().includes(searchTerm) ||
        currency.sell_rate.toString().includes(searchTerm)
      );
    });
  }, [searchTerm, currencies]);

  useEffect(() => {
    const abortController = new AbortController();

    const loadCurrencies = async () => {
      try {
        await fetchCurrencies();
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Failed to fetch currencies:", error);
        }
      }
    };

    loadCurrencies();

    return () => {
      abortController.abort();
    };
  }, [fetchCurrencies]);

  const validateForm = (formData, editingCurrency) => {
    // For new currency creation, only require currency_code and currency_name
    if (!editingCurrency) {
      const { currency_code, currency_name } = formData;
      return !(!currency_code || !currency_name);
    }

    // For updates, check if at least one field has changed
    const hasChanges = Object.keys(formData).some((key) => {
      if (key === "icon") return formData.icon !== null;
      // Allow empty strings for nullable fields (buy_rate and sell_rate)
      return formData[key] !== "" && formData[key] !== editingCurrency[key];
    });

    return hasChanges || formData.icon !== null;
  };

  // Form handling
  const handleFormChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleIconChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type !== "image/svg+xml") {
        showErrorAlert("Please upload an SVG file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showErrorAlert("File size should be less than 2MB");
        return;
      }

      setFormData((prev) => ({ ...prev, icon: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewIcon(reader.result);
      reader.readAsDataURL(file);
    },
    [showErrorAlert]
  );

  const clearIconSelection = () => {
    setPreviewIcon(null);
    setFormData({ ...formData, icon: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Currency code validation
    if (!editingCurrency && !validateCurrencyCode(formData.currency_code)) {
      showErrorAlert(
        "Invalid currency code format. Valid formats:\n- USD\n- USDp/w\n- USD1\n- CNY100-50\n- HKD500-1K"
      );
      return;
    }

    // Updated validation check
    if (!validateForm(formData, editingCurrency)) {
      if (!editingCurrency) {
        showErrorAlert(
          "Please fill in all required fields (Currency Code and Currency Name)"
        );
      } else {
        showErrorAlert("No changes detected");
      }
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();

      if (editingCurrency) {
        // For updates, only send fields that have changed
        Object.keys(formData).forEach((key) => {
          if (key === "icon") {
            if (formData.icon instanceof File) {
              formDataToSend.append("icon", formData.icon);
            }
          } else if (formData[key] !== editingCurrency[key]) {
            // Allow sending empty values for nullable fields
            formDataToSend.append(key, formData[key]);
          }
        });
        formDataToSend.append("_method", "PUT");
      } else {
        // For new currency, send all fields (including empty ones for nullable fields)
        formDataToSend.append("currency_code", formData.currency_code);
        formDataToSend.append("currency_name", formData.currency_name);
        if (formData.buy_rate !== "") {
          formDataToSend.append("buy_rate", formData.buy_rate);
        }
        if (formData.sell_rate !== "") {
          formDataToSend.append("sell_rate", formData.sell_rate);
        }
        if (formData.icon instanceof File) {
          formDataToSend.append("icon", formData.icon);
        }
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      };

      const response = await api.post(
        editingCurrency
          ? `/currencies/${editingCurrency.currency_code}`
          : "/currencies",
        formDataToSend,
        config
      );

      if (response.status === "success") {
        showSuccessAlert(response.message);
        await fetchCurrencies();
        resetForm();
      } else {
        throw new Error(response.message || "Operation failed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      showErrorAlert(err.message || "Failed to save currency");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      currency_code: "",
      currency_name: "",
      buy_rate: "",
      sell_rate: "",
      icon: null,
    });
    setPreviewIcon(null);
    setEditingCurrency(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startEdit = async (currency) => {
    const result = await showConfirmationAlert(
      "Edit Currency",
      `Are you sure you want to edit ${currency.currency_name}?`
    );

    if (result.isConfirmed) {
      setEditingCurrency(currency);
      setFormData({
        currency_code: currency.currency_code,
        currency_name: currency.currency_name || "",
        buy_rate: currency.buy_rate || "",
        sell_rate: currency.sell_rate || "",
        icon: null,
      });
      setPreviewIcon(currency.icon_url);

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (currency) => {
    const result = await showConfirmationAlert(
      "Delete Currency",
      `Are you sure you want to delete ${currency.currency_name}?`
    );

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await api.delete(
          `/currencies/${currency.currency_code}`
        );

        if (response.status === "success") {
          showSuccessAlert(response.message);
          await fetchCurrencies();
        } else {
          throw new Error(response.message || "Delete operation failed");
        }
      } catch (err) {
        console.error("Delete error:", err);
        showErrorAlert(err.message || "Failed to delete currency");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteAll = async () => {
    const result = await showConfirmationAlert(
      "Delete All Currencies",
      "Are you sure you want to delete all currencies? This action cannot be undone."
    );

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await api.delete("/currencies");

        if (response.status === "success") {
          showSuccessAlert(
            response.message || "All currencies have been deleted successfully"
          );
          await fetchCurrencies();
          setSearchTerm(""); // Reset search term after deletion
        } else {
          throw new Error(response.message || "Delete operation failed");
        }
      } catch (err) {
        console.error("Delete all error:", err);
        showErrorAlert(err.message || "Failed to delete all currencies");
      } finally {
        setLoading(false);
      }
    }
  };

  const CurrencyTableRow = React.memo(
    ({ currency, loading, handleDelete, startEdit, tableDataClass }) => (
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${tableRowClass} hover:bg-gray-700/50 transition-colors`}
        layout
      >
        <td className={`p-4 ${tableDataClass}`}>
          {currency.icon_url ? (
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={currency.icon_url}
              alt={`${currency.currency_code} icon`}
              className="h-8 w-8 object-contain"
            />
          ) : (
            <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-400">No Icon</span>
            </div>
          )}
        </td>
        <td className={`p-4 ${tableDataClass}`}>
          <span className="font-medium">{currency.currency_code}</span>
        </td>
        <td className={`p-4 ${tableDataClass}`}>{currency.currency_name}</td>
        <td className={`p-4 ${tableDataClass}`}>
          <span className="text-white">
            Rp.{" "}
            {parseFloat(currency.buy_rate || 0).toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </td>
        <td className={`p-4 ${tableDataClass}`}>
          <span className="text-white">
            Rp.{" "}
            {parseFloat(currency.sell_rate || 0).toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </td>
        <td className="p-4">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => startEdit(currency)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors tooltip-trigger"
              disabled={loading}
              title="Edit Currency"
            >
              <Pencil size={18} className="text-blue-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDelete(currency)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors tooltip-trigger"
              disabled={loading}
              title="Delete Currency"
            >
              <Trash2 size={18} className="text-red-400" />
            </motion.button>
          </div>
        </td>
      </motion.tr>
    )
  );

  // Loading component with better UX
  if (loading && initialRender.current) {
    initialRender.current = false;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <MainLoading isDark message="Loading currency data..." size={40} />
      </div>
    );
  }
  const validateCurrencyCode = (code) => {
    // First 3 chars must be uppercase letters
    // Then optional p/w (case sensitive)
    // Or optional numbers with optional -number and optional K suffix
    return /^[A-Z]{3}(?:p\/w|(?:[0-9]+(?:-[0-9]+K?)?)?)?$/.test(code);
  };

  return (
    <div className="p-6 space-y-6 font-poppins">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${textClass}`}>
          Currency Management
        </h1>
        <div className="flex gap-2">
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            Clear Form
          </button>
          {currencies.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <Trash2 size={18} />
              Delete All
            </button>
          )}
        </div>
      </div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${cardClass} p-4 rounded-lg shadow-lg`}
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <FormInput
            label="Currency Code"
            type="text"
            placeholder="e.g., USD, USDp/w, USD1"
            value={formData.currency_code}
            onChange={(e) => {
              // Just update the value directly, allowing mixed case
              setFormData({ ...formData, currency_code: e.target.value });
            }}
            disabled={editingCurrency}
            required
            maxLength={20}
            title="Enter a valid currency code (e.g., USD, USDp/w, USD1)"
          />
          <FormInput
            label="Currency Name"
            type="text"
            placeholder="e.g., US Dollar"
            value={formData.currency_name}
            onChange={(e) =>
              setFormData({ ...formData, currency_name: e.target.value })
            }
            required
          />
          <FormInput
            label="Buy Rate (Optional)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.buy_rate}
            onChange={(e) =>
              setFormData({ ...formData, buy_rate: e.target.value })
            }
            required={false}
          />
          <FormInput
            label="Sell Rate (Optional)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.sell_rate}
            onChange={(e) =>
              setFormData({ ...formData, sell_rate: e.target.value })
            }
            required={false}
          />
          <div className="lg:col-span-4 space-y-3">
            <label className={`text-sm font-medium ${textClass}`}>
              Currency Icon (SVG and PNG only)
            </label>

            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
              <div className="flex-1 min-w-0">
                <select
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  value={selectedPresetIcon}
                  onChange={(e) => handlePresetIconSelect(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select flags icon</option>
                  {iconOptions
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((opt) => (
                      <option key={opt.file} value={opt.file}>
                        {opt.label}
                      </option>
                    ))}
                </select>
              </div>

              <span className="text-gray-400 flex-shrink-0">or</span>

              {/* Tetap boleh upload custom icon */}
              <div className="flex-1 min-w-0">
                <FileInput
                  label=""
                  accept=".svg"
                  onChange={handleIconChange}
                  previewIcon={previewIcon}
                  onClear={clearIconSelection}
                  loading={loading}
                  required={false}
                  inputRef={fileInputRef}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <button
              type="submit"
              className="w-full bg-orange-700 font-semibold text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  {editingCurrency ? "Updating..." : "Adding..."}
                </span>
              ) : editingCurrency ? (
                "Update Currency"
              ) : (
                "Add Currency"
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${cardClass} rounded-lg shadow-lg`}
      >
        {/* Search and Info Section */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search currencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg pl-10 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Showing {filteredCurrencies.length} of {currencies.length}{" "}
              currencies
            </div>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="relative overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <table className="w-full table-auto">
              <thead className="sticky top-0 z-10 bg-gray-800">
                <tr className={tableHeaderClass}>
                  <th className="text-left p-4 font-medium whitespace-nowrap">
                    Icon
                  </th>
                  <th className="text-left p-4 font-medium whitespace-nowrap">
                    Currency Code
                  </th>
                  <th className="text-left p-4 font-medium whitespace-nowrap">
                    Currency Name
                  </th>
                  <th className="text-left p-4 font-medium whitespace-nowrap">
                    Buy Rate
                  </th>
                  <th className="text-left p-4 font-medium whitespace-nowrap">
                    Sell Rate
                  </th>
                  <th className="text-left p-4 font-medium whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredCurrencies.length > 0 ? (
                  filteredCurrencies
                    .slice()
                    .reverse()
                    .map((currency) => (
                      <CurrencyTableRow
                        key={currency.currency_code}
                        currency={currency}
                        loading={loading}
                        handleDelete={handleDelete}
                        startEdit={startEdit}
                        tableDataClass={tableDataClass}
                        tableRowClass={tableRowClass}
                      />
                    ))
                ) : (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td
                      colSpan="6"
                      className={`p-8 text-center ${tableDataClass}`}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle size={24} className="text-gray-400" />
                        <p className="text-gray-400">
                          {searchTerm
                            ? "No currencies match your search"
                            : "No currencies available"}
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={() =>
                              window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                            className="text-orange-500 hover:text-orange-400 transition-colors"
                          >
                            Add your first currency
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Loading Overlay */}
      {loading && !initialRender.current && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <MainLoading isDark message="Processing..." size={40} />
        </div>
      )}
    </div>
  );
};

export default CurrencyManipulation;