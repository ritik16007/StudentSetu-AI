document.addEventListener("DOMContentLoaded", function () {
  // Forms and Lists
  const documentForm = document.getElementById("documentForm");
  const documentList = document.getElementById("documentList");

  const deadlineForm = document.getElementById("deadlineForm");
  const deadlineList = document.getElementById("deadlineList");

  const mailForm = document.getElementById("mailForm");
  const mailOutput = document.getElementById("mailOutput");
  const copyMailBtn = document.getElementById("copyMailBtn");

  const applicationForm = document.getElementById("applicationForm");
  const applicationList = document.getElementById("applicationList");

  const searchInput = document.getElementById("searchInput");

  // Dashboard Count Elements
  const docCount = document.getElementById("docCount");
  const deadlineCount = document.getElementById("deadlineCount");
  const applicationCount = document.getElementById("applicationCount");

  const importFile = document.getElementById("importFile");
  // Local Storage Data
  let documents = JSON.parse(localStorage.getItem("studentDocuments")) || [];
  let deadlines = JSON.parse(localStorage.getItem("studentDeadlines")) || [];
  let applications = JSON.parse(localStorage.getItem("studentApplications")) || [];

  let currentFilter = "all";

  // Save Functions
  function saveDocuments() {
    localStorage.setItem("studentDocuments", JSON.stringify(documents));
  }

  function saveDeadlines() {
    localStorage.setItem("studentDeadlines", JSON.stringify(deadlines));
  }

  function saveApplications() {
    localStorage.setItem("studentApplications", JSON.stringify(applications));
  }

  function getSearchText() {
    return searchInput ? searchInput.value.toLowerCase() : "";
  }

  // Dashboard Counts
  function updateDashboardCounts() {
    if (docCount) {
      docCount.textContent = `${documents.length} documents added`;
    }

    if (deadlineCount) {
      deadlineCount.textContent = `${deadlines.length} deadlines added`;
    }

    if (applicationCount) {
      applicationCount.textContent = `${applications.length} applications added`;
    }
  }

  // Show Documents
  function showDocuments() {
    if (!documentList) return;

    documentList.innerHTML = "";
    const searchText = getSearchText();

    const filteredDocuments = documents.filter(function (doc) {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchText) ||
        doc.type.toLowerCase().includes(searchText) ||
        doc.status.toLowerCase().includes(searchText) ||
        (doc.notes && doc.notes.toLowerCase().includes(searchText));

      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "pending" && doc.status === "Pending") ||
        (currentFilter === "submitted" && doc.status === "Submitted") ||
        (currentFilter === "hardcopy" && doc.status === "Need Hard Copy");

      return matchesSearch && matchesFilter;
    });

    if (filteredDocuments.length === 0) {
      documentList.innerHTML = `<p class="empty-message">No documents found.</p>`;
      return;
    }

    filteredDocuments.forEach(function (doc) {
      const realIndex = documents.indexOf(doc);
      const statusClass = doc.status.replaceAll(" ", "-");

      const documentCard = document.createElement("div");
      documentCard.className = "document-card";

      documentCard.innerHTML = `
        <h3>${doc.name}</h3>
        <p><strong>Type:</strong> ${doc.type}</p>
        <p><strong>Notes:</strong> ${doc.notes || "No notes added"}</p>
        <span class="status ${statusClass}">${doc.status}</span>
        <br>
        <button type="button" onclick="updateDocumentStatus(${realIndex})">Update Status</button>
        <button type="button" class="delete-btn" onclick="deleteDocument(${realIndex})">Delete</button>
      `;

      documentList.appendChild(documentCard);
    });
  }

  // Show Deadlines
  function showDeadlines() {
    if (!deadlineList) return;

    deadlineList.innerHTML = "";
    const searchText = getSearchText();

    const filteredDeadlines = deadlines.filter(function (task) {
      const matchesSearch =
        task.name.toLowerCase().includes(searchText) ||
        task.date.toLowerCase().includes(searchText) ||
        task.priority.toLowerCase().includes(searchText) ||
        task.status.toLowerCase().includes(searchText);

      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "pending" && task.status === "Pending") ||
        (currentFilter === "urgent" && task.priority === "Urgent");

      return matchesSearch && matchesFilter;
    });

    if (filteredDeadlines.length === 0) {
      deadlineList.innerHTML = `<p class="empty-message">No deadlines found.</p>`;
      return;
    }

    filteredDeadlines.forEach(function (task) {
      const realIndex = deadlines.indexOf(task);
      const priorityClass = task.priority.replaceAll(" ", "-");
      const statusClass = task.status.replaceAll(" ", "-");

      const deadlineCard = document.createElement("div");
      deadlineCard.className = "document-card";

      deadlineCard.innerHTML = `
        <h3>${task.name}</h3>
        <p><strong>Due Date:</strong> ${task.date}</p>
        <span class="priority ${priorityClass}">${task.priority}</span>
        <span class="status ${statusClass}">${task.status}</span>
        <br>
        <button type="button" onclick="updateDeadlineStatus(${realIndex})">Update Status</button>
        <button type="button" class="delete-btn" onclick="deleteDeadline(${realIndex})">Delete</button>
      `;

      deadlineList.appendChild(deadlineCard);
    });
  }

  // Show Applications
  function showApplications() {
    if (!applicationList) return;

    applicationList.innerHTML = "";
    const searchText = getSearchText();

    const filteredApplications = applications.filter(function (app) {
      const matchesSearch =
        app.name.toLowerCase().includes(searchText) ||
        app.platform.toLowerCase().includes(searchText) ||
        app.status.toLowerCase().includes(searchText) ||
        (app.id && app.id.toLowerCase().includes(searchText)) ||
        (app.nextAction && app.nextAction.toLowerCase().includes(searchText));

      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "pending" && app.status === "Verification Pending") ||
        (currentFilter === "submitted" && app.status === "Applied") ||
        (currentFilter === "urgent" && app.status === "Need Follow-up");

      return matchesSearch && matchesFilter;
    });

    if (filteredApplications.length === 0) {
      applicationList.innerHTML = `<p class="empty-message">No applications found.</p>`;
      return;
    }

    filteredApplications.forEach(function (app) {
      const realIndex = applications.indexOf(app);
      const statusClass = app.status.replaceAll(" ", "-");

      const applicationCard = document.createElement("div");
      applicationCard.className = "document-card";

      applicationCard.innerHTML = `
        <h3>${app.name}</h3>
        <p><strong>Platform / Bank:</strong> ${app.platform}</p>
        <p><strong>Application ID:</strong> ${app.id || "Not added"}</p>
        <p><strong>Next Action:</strong> ${app.nextAction || "No action added"}</p>
        <span class="status ${statusClass}">${app.status}</span>
        <br>
        <button type="button" onclick="updateApplicationStatus(${realIndex})">Update Status</button>
        <button type="button" class="delete-btn" onclick="deleteApplication(${realIndex})">Delete</button>
      `;

      applicationList.appendChild(applicationCard);
    });
  }

  // Refresh All
  function refreshAll() {
    showDocuments();
    showDeadlines();
    showApplications();
    updateDashboardCounts();
  }

  // Filter Function
  window.setFilter = function (filterValue) {
    currentFilter = filterValue;
    refreshAll();
  };

  // Delete Functions
  window.deleteDocument = function (index) {
    documents.splice(index, 1);
    saveDocuments();
    refreshAll();
  };

  window.deleteDeadline = function (index) {
    deadlines.splice(index, 1);
    saveDeadlines();
    refreshAll();
  };

  window.deleteApplication = function (index) {
    applications.splice(index, 1);
    saveApplications();
    refreshAll();
  };

  // Update Status Functions
  window.updateDocumentStatus = function (index) {
    const newStatus = prompt(
      "Enter new status: Available, Applied, Pending, Submitted, Need Hard Copy"
    );

    if (!newStatus) return;

    const allowedStatus = [
      "Available",
      "Applied",
      "Pending",
      "Submitted",
      "Need Hard Copy"
    ];

    if (!allowedStatus.includes(newStatus)) {
      alert("Invalid status. Please type status exactly as shown.");
      return;
    }

    documents[index].status = newStatus;
    saveDocuments();
    refreshAll();
  };

  window.updateDeadlineStatus = function (index) {
    const newStatus = prompt(
      "Enter new status: Pending, In Progress, Completed"
    );

    if (!newStatus) return;

    const allowedStatus = [
      "Pending",
      "In Progress",
      "Completed"
    ];

    if (!allowedStatus.includes(newStatus)) {
      alert("Invalid status. Please type status exactly as shown.");
      return;
    }

    deadlines[index].status = newStatus;
    saveDeadlines();
    refreshAll();
  };

  window.updateApplicationStatus = function (index) {
    const newStatus = prompt(
      "Enter new status: Applied, Under Review, Verification Pending, Approved, Rejected, Need Follow-up"
    );

    if (!newStatus) return;

    const allowedStatus = [
      "Applied",
      "Under Review",
      "Verification Pending",
      "Approved",
      "Rejected",
      "Need Follow-up"
    ];

    if (!allowedStatus.includes(newStatus)) {
      alert("Invalid status. Please type status exactly as shown.");
      return;
    }

    applications[index].status = newStatus;
    saveApplications();
    refreshAll();
  };

  // Add Document
  if (documentForm) {
    documentForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const docName = document.getElementById("docName").value.trim();
      const docType = document.getElementById("docType").value;
      const docStatus = document.getElementById("docStatus").value;
      const docNotes = document.getElementById("docNotes").value.trim();

      const newDocument = {
        name: docName,
        type: docType,
        status: docStatus,
        notes: docNotes
      };

      documents.push(newDocument);
      saveDocuments();
      refreshAll();
      documentForm.reset();
    });
  }

  // Add Deadline
  if (deadlineForm) {
    deadlineForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const taskName = document.getElementById("taskName").value.trim();
      const dueDate = document.getElementById("dueDate").value;
      const priority = document.getElementById("priority").value;
      const taskStatus = document.getElementById("taskStatus").value;

      const newDeadline = {
        name: taskName,
        date: dueDate,
        priority: priority,
        status: taskStatus
      };

      deadlines.push(newDeadline);
      saveDeadlines();
      refreshAll();
      deadlineForm.reset();
    });
  }

  // Add Application
  if (applicationForm) {
    applicationForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const appName = document.getElementById("appName").value.trim();
      const appPlatform = document.getElementById("appPlatform").value.trim();
      const appId = document.getElementById("appId").value.trim();
      const appStatus = document.getElementById("appStatus").value;
      const nextAction = document.getElementById("nextAction").value.trim();

      const newApplication = {
        name: appName,
        platform: appPlatform,
        id: appId,
        status: appStatus,
        nextAction: nextAction
      };

      applications.push(newApplication);
      saveApplications();
      refreshAll();
      applicationForm.reset();
    });
  }

  // Mail Draft Generator
  if (mailForm) {
    mailForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const mailType = document.getElementById("mailType").value;
      const receiverName = document.getElementById("receiverName").value.trim();
      const institutionName = document.getElementById("institutionName").value.trim();
      const mailIssue = document.getElementById("mailIssue").value.trim();
      const studentName = document.getElementById("studentName").value.trim();

      let subject = "";
      let body = "";

      if (mailType === "migration") {
        subject = "Request Regarding Migration Certificate Hard Copy";

        body = `Dear ${receiverName},

I am ${studentName}, a former student of ${institutionName}. I want to request guidance regarding my migration certificate hard copy.

${mailIssue}

Kindly let me know the process, required documents, fees if any, and when I can receive the hard copy of my migration certificate.

Thank you.

Yours sincerely,
${studentName}`;
      }

      else if (mailType === "marksheet") {
        subject = "Request to Update Class 12 Marksheet";

        body = `Dear ${receiverName},

I am ${studentName}. My updated Class 12 result/marksheet has been declared after the re-evaluation process.

${mailIssue}

I request you to kindly guide me on how I can update my previously submitted marksheet in the admission/application records.

Thank you.

Yours sincerely,
${studentName}`;
      }

      else if (mailType === "loan") {
        subject = "Request for Education Loan Application Status Update";

        body = `Dear ${receiverName},

I am ${studentName}. I have applied for an education loan through ${institutionName}.

${mailIssue}

I request you to kindly update me about the current status of my application and guide me regarding the next required steps.

Thank you.

Yours sincerely,
${studentName}`;
      }

      else if (mailType === "scholarship") {
        subject = "Query Regarding Scholarship Application";

        body = `Dear ${receiverName},

I am ${studentName}. I am writing this mail regarding my scholarship application/query.

${mailIssue}

Kindly guide me regarding the eligibility, required documents, application status, and next process.

Thank you.

Yours sincerely,
${studentName}`;
      }

      else {
        subject = "Request for Guidance";

        body = `Dear ${receiverName},

I am ${studentName}. I am writing this mail to request your guidance.

${mailIssue}

Kindly look into this matter and guide me regarding the next steps.

Thank you.

Yours sincerely,
${studentName}`;
      }

      const finalMail = `Subject: ${subject}

${body}`;

      mailOutput.textContent = finalMail;
    });
  }

  // Copy Mail
  if (copyMailBtn) {
    copyMailBtn.addEventListener("click", function () {
      const mailText = mailOutput.textContent;

      if (!mailText || mailText.includes("Your generated mail will appear here")) {
        alert("Please generate a mail first.");
        return;
      }

      navigator.clipboard.writeText(mailText);
      alert("Mail copied successfully!");
    });
  }

  // Search Input
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      refreshAll();
    });
  }

  // Print Summary
  window.printSummary = function () {
    let summary = "StudentSetu AI - Student Record Summary\n\n";

    summary += "========================\n";
    summary += "DOCUMENTS\n";
    summary += "========================\n";

    if (documents.length === 0) {
      summary += "No documents added.\n";
    } else {
      documents.forEach(function (doc, index) {
        summary += `
${index + 1}. ${doc.name}
Type: ${doc.type}
Status: ${doc.status}
Notes: ${doc.notes || "No notes added"}
`;
      });
    }

    summary += "\n========================\n";
    summary += "DEADLINES\n";
    summary += "========================\n";

    if (deadlines.length === 0) {
      summary += "No deadlines added.\n";
    } else {
      deadlines.forEach(function (task, index) {
        summary += `
${index + 1}. ${task.name}
Due Date: ${task.date}
Priority: ${task.priority}
Status: ${task.status}
`;
      });
    }

    summary += "\n========================\n";
    summary += "LOAN / SCHOLARSHIP APPLICATIONS\n";
    summary += "========================\n";

    if (applications.length === 0) {
      summary += "No applications added.\n";
    } else {
      applications.forEach(function (app, index) {
        summary += `
${index + 1}. ${app.name}
Platform / Bank: ${app.platform}
Application ID: ${app.id || "Not added"}
Status: ${app.status}
Next Action: ${app.nextAction || "No action added"}
`;
      });
    }

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Popup blocked. Please allow popups for this page.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>StudentSetu AI Summary</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              line-height: 1.6;
            }

            pre {
              white-space: pre-wrap;
              font-size: 15px;
            }

            h1 {
              color: #2563eb;
            }
          </style>
        </head>
        <body>
          <h1>StudentSetu AI Summary</h1>
          <pre>${summary}</pre>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Export JSON
  window.exportJSON = function () {
    const studentData = {
      documents: documents,
      deadlines: deadlines,
      applications: applications,
      exportedAt: new Date().toLocaleString()
    };

    const dataStr = JSON.stringify(studentData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "studentsetu-data.json";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(downloadLink.href);
  };

  // Import JSON
if (importFile) {
  importFile.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);

        if (
          !importedData.documents ||
          !importedData.deadlines ||
          !importedData.applications
        ) {
          alert("Invalid backup file.");
          return;
        }

        const confirmImport = confirm(
          "This will replace your current data with imported data. Continue?"
        );

        if (!confirmImport) return;

        documents = importedData.documents;
        deadlines = importedData.deadlines;
        applications = importedData.applications;

        saveDocuments();
        saveDeadlines();
        saveApplications();

        refreshAll();

        alert("Data imported successfully!");
      } catch (error) {
        alert("Invalid JSON file.");
      }
    };

    reader.readAsText(file);
  });
}
  // Initial Load
  refreshAll();
});